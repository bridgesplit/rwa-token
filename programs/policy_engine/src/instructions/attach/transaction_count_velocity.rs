use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct AttachTransactionCountVelocity<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: internal ix checks
    pub signer: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [policy_engine.asset_mint.as_ref()],
        bump,
        constraint = policy_engine.verify_signer(policy_engine.key(), signer.key(), signer.is_signer).is_ok()
    )]
    pub policy_engine: Box<Account<'info, PolicyEngine>>,
    #[account(
        init,
        signer,
        space = TransactionCountVelocity::LEN,
        payer = payer,
    )]
    pub policy: Box<Account<'info, TransactionCountVelocity>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AttachTransactionCountVelocity>,
    limit: u64,
    timeframe: i64,
    identity_filter: IdentityFilter,
) -> Result<()> {
    ctx.accounts.policy.new(limit, timeframe, identity_filter);
    ctx.accounts
        .policy_engine
        .add_policy(ctx.accounts.policy.key())?;
    ctx.accounts.policy_engine.update_max_timeframe(timeframe);
    Ok(())
}
