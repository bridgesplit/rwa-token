use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};
use identity_registry::{
    program::IdentityRegistry, IdentityAccount, IdentityRegistryAccount, SKIP_POLICY_LEVEL,
};
use policy_engine::{enforce_policy, program::PolicyEngine, PolicyAccount, PolicyEngineAccount};

use crate::state::*;

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
        owner = identity_registry.key(),
        constraint = identity_registry_account.asset_mint == asset_mint.key(),
    )]
    pub identity_registry_account: Account<'info, IdentityRegistryAccount>,
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
    #[account(
        owner = policy_engine.key(),
        constraint = policy_account.policy_engine == policy_engine_account.key(),
    )]
    pub policy_account: Account<'info, PolicyAccount>,
}

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

    // evaluate policy
    enforce_policy(
        ctx.accounts.policy_account.policies.clone(),
        amount,
        Clock::get()?.unix_timestamp,
        &ctx.accounts.identity_account.levels,
        &ctx.accounts.tracker_account.transfers,
    )?;

    ctx.accounts.tracker_account.update_transfer_history(
        amount,
        Clock::get()?.unix_timestamp,
        ctx.accounts.policy_engine_account.max_timeframe,
    )?;

    Ok(())
}
