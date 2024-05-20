use anchor_lang::{
    prelude::*,
    solana_program::sysvar::{self},
};
use anchor_spl::token_interface::{Mint, TokenAccount};
use identity_registry::{program::IdentityRegistry, IdentityAccount, SKIP_POLICY_LEVEL};
use policy_engine::{enforce_policy, program::PolicyEngine, PolicyAccount, PolicyEngineAccount};

use crate::{state::*, verify_cpi_program_is_token22, verify_pda};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct ExecuteTransferHook<'info> {
    #[account(
        associated_token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
        associated_token::authority = owner_delegate,
        associated_token::mint = asset_mint,
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
    // can be any token account, user must make sure it is an associated token account with relevant identity permissions
    pub destination_account: Box<InterfaceAccount<'info, TokenAccount>>,
    /// CHECK: can be any account
    pub owner_delegate: UncheckedAccount<'info>,
    /// CHECK: meta list account
    #[account(
        seeds = [META_LIST_ACCOUNT_SEED, asset_mint.key().as_ref()],
        bump,
    )]
    pub extra_metas_account: UncheckedAccount<'info>,
    pub policy_engine: Program<'info, PolicyEngine>,
    #[account(
        owner = policy_engine.key(),
    )]
    /// CHECK: internal ix checks
    pub policy_engine_account: UncheckedAccount<'info>,
    pub identity_registry: Program<'info, IdentityRegistry>,
    #[account()]
    /// CHECK: internal ix checks
    pub identity_registry_account: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: internal ix checks
    pub identity_account: UncheckedAccount<'info>,
    #[account(
        mut,
        constraint = tracker_account.owner == owner_delegate.key(),
        constraint = tracker_account.asset_mint == asset_mint.key(),
    )]
    pub tracker_account: Box<Account<'info, TrackerAccount>>,
    #[account()]
    /// CHECK: internal ix checks
    pub policy_account: UncheckedAccount<'info>,
    #[account(constraint = instructions_program.key() == sysvar::instructions::id())]
    /// CHECK: constraint check
    pub instructions_program: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
    verify_cpi_program_is_token22(&ctx.accounts.instructions_program.to_account_info(), amount)?;

    let asset_mint = ctx.accounts.asset_mint.key();

    verify_pda(
        ctx.accounts.policy_engine_account.key(),
        &[&asset_mint.to_bytes()],
        &policy_engine::id(),
    )?;

    verify_pda(
        ctx.accounts.policy_account.key(),
        &[&ctx.accounts.policy_engine_account.key().to_bytes()],
        &policy_engine::id(),
    )?;

    // if policy account hasnt been created, skip enforcing token hook logic
    if ctx.accounts.policy_account.data_is_empty() {
        return Ok(());
    }

    let policy_engine_account = PolicyEngineAccount::deserialize(
        &mut &ctx.accounts.policy_engine_account.data.borrow()[8..],
    )?;

    let policy_account =
        PolicyAccount::deserialize(&mut &ctx.accounts.policy_account.data.borrow()[8..])?;

    // go through with transfer if there aren't any policies attached
    if policy_account.policies.is_empty() {
        return Ok(());
    }

    // user must have identity account setup if there are policies attached
    verify_pda(
        ctx.accounts.identity_registry_account.key(),
        &[&asset_mint.to_bytes()],
        &identity_registry::id(),
    )?;

    verify_pda(
        ctx.accounts.identity_account.key(),
        &[
            &ctx.accounts.identity_registry_account.key().to_bytes(),
            &ctx.accounts.owner_delegate.key().to_bytes(),
        ],
        &identity_registry::id(),
    )?;

    let identity_account =
        IdentityAccount::deserialize(&mut &ctx.accounts.identity_account.data.borrow()[8..])?;

    // if user has identity skip level, skip enforcing policy
    if identity_account.levels.contains(&SKIP_POLICY_LEVEL) {
        return Ok(());
    }

    // evaluate policies
    enforce_policy(
        policy_account.policies.clone(),
        amount,
        Clock::get()?.unix_timestamp,
        &identity_account.levels,
        &ctx.accounts.tracker_account.transfers,
    )?;

    // update transfer history
    ctx.accounts.tracker_account.update_transfer_history(
        amount,
        Clock::get()?.unix_timestamp,
        policy_engine_account.max_timeframe,
    )?;

    Ok(())
}
