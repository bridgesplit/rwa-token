use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct AttachToPolicyAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: internal ix checks
    pub signer: UncheckedAccount<'info>,
    #[account(
        mut,
        constraint = policy_engine.verify_signer(policy_engine.key(), signer.key(), signer.is_signer).is_ok()
    )]
    pub policy_engine: Box<Account<'info, PolicyEngineAccount>>,
    #[account(
        mut,
        seeds = [policy_engine.key().as_ref()],
        bump,
        realloc = policy_account.to_account_info().data_len() + Policy::INIT_SPACE,
        realloc::zero = false,
        realloc::payer = payer,
    )]
    pub policy_account: Box<Account<'info, PolicyAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AttachToPolicyAccount>,
    identity_filter: IdentityFilter,
    policy_type: PolicyType,
) -> Result<()> {
    ctx.accounts
        .policy_account
        .attach(policy_type, identity_filter);
    ctx.accounts.policy_engine.update_max_timeframe(policy_type);
    Ok(())
}
