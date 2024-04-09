use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct AttachToPolicyAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = policy_engine.authority == signer.key() || policy_engine.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account(mut)]
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
    let policy_account_address = ctx.accounts.policy_account.key();
    ctx.accounts
        .policy_account
        .attach(policy_account_address, policy_type, identity_filter)?;
    ctx.accounts.policy_engine.update_max_timeframe(policy_type);
    Ok(())
}
