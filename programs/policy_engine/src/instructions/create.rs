use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CreatePolicyAccount<'info> {
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
        init,
        seeds = [policy_engine.key().as_ref()],
        bump,
        space = 8 + PolicyAccount::INIT_SPACE,
        payer = payer,
    )]
    pub policy_account: Box<Account<'info, PolicyAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreatePolicyAccount>,
    identity_filter: IdentityFilter,
    policy_type: PolicyType,
) -> Result<()> {
    ctx.accounts.policy_account.new(
        ctx.accounts.policy_engine.key(),
        identity_filter,
        policy_type,
    );
    Ok(())
}
