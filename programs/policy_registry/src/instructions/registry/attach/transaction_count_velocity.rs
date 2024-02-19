use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct AttachTransactionCountVelocity<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = policy_registry.authority == authority.key(),
    )]
    pub policy_registry: Box<Account<'info, PolicyRegistry>>,
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
        .policy_registry
        .add_policy(ctx.accounts.policy.key())?;
    ctx.accounts.policy_registry.update_max_timeframe(timeframe);
    Ok(())
}
