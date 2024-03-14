use std::ops::Deref;

use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};
use identity_registry::{program::IdentityRegistry, IdentityAccount, SKIP_POLICY_LEVEL};
use policy_engine::{deserialize_and_enforce_policy, program::PolicyEngine, PolicyEngineAccount};

use crate::{state::*, AssetControllerErrors};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct ExecuteTransferHook<'info> {
    #[account(
        token::mint = asset_mint,
        token::authority = owner_delegate,
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub source_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        token::mint = asset_mint,
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub destination_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub owner_delegate: SystemAccount<'info>,
    /// CHECK: meta list account
    #[account(
        seeds = [META_LIST_ACCOUNT_SEED, asset_mint.key().as_ref()],
        bump,
    )]
    pub extra_metas_account: UncheckedAccount<'info>,
    pub policy_engine: Program<'info, PolicyEngine>,
    #[account(
        owner = policy_engine.key(),
        constraint = policy_engine_account.asset_mint == asset_mint.key(),
    )]
    pub policy_engine_account: Account<'info, PolicyEngineAccount>,
    pub identity_registry: Program<'info, IdentityRegistry>,
    #[account(
        mut,
        owner = identity_registry.key(),
        constraint = identity_account.owner == owner_delegate.key(),
    )]
    pub identity_account: Account<'info, IdentityAccount>,
    #[account(
        mut,
        constraint = tracker_account.owner == owner_delegate.key(),
        constraint = tracker_account.asset_mint == asset_mint.key(),
    )]
    pub tracker_account: Account<'info, TrackerAccount>,
}
/// This function evalutes policies assocated with a token transfer operation.
/// It enforces them if necessary and updates the transfer history accordingly.
/// Lastly, it ensures compliance with predefined policies and constraints.
/// This is what allows for permissioned transfer of assets.
pub fn handler(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
    // if user has identity skip level, can skip enforcing policy
    if ctx
        .accounts
        .identity_account
        .levels
        .contains(&SKIP_POLICY_LEVEL)
    {
        return Ok(());
    }
    let remaining_accounts = ctx.remaining_accounts.to_vec();
    let policies = ctx
        .accounts
        .policy_engine_account
        .policies
        .iter()
        .filter(|x| x != &&Pubkey::default())
        .collect::<Vec<_>>();
    let transfer_amounts = ctx.accounts.tracker_account.transfer_amounts;
    let transfer_timestamps = ctx.accounts.tracker_account.transfer_timestamps;
    if remaining_accounts.len() < policies.len() {
        return Err(AssetControllerErrors::PolicyAccountsMissing.into());
    }
    for (i, policy) in policies[..].iter().enumerate() {
        // evaluate policy
        let policy_account = &remaining_accounts[i];
        if policy_account.key != *policy {
            return Err(AssetControllerErrors::InvalidPolicyAccount.into());
        }
        let policy_account = remaining_accounts[i]
            .data
            .try_borrow_mut()
            .map_err(|_| AssetControllerErrors::InvalidPolicyAccount)?;
        deserialize_and_enforce_policy(
            policy_account.deref(),
            amount,
            Clock::get()?.unix_timestamp,
            ctx.accounts.identity_account.levels,
            transfer_amounts,
            transfer_timestamps,
        )?;
    }

    let timestamp = Clock::get()?.unix_timestamp;
    let max_timeframe = ctx.accounts.policy_engine_account.max_timeframe;
    ctx.accounts
        .tracker_account
        .update_transfer_history(amount, timestamp, max_timeframe)?;

    Ok(())
}
