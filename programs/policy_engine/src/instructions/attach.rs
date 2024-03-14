use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct AttachIdentityApproval<'info> {
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
        signer,
        space = 8 + PolicyAccount::INIT_SPACE,
        payer = payer,
    )]
    pub policy_account: Box<Account<'info, PolicyAccount>>,
    pub system_program: Program<'info, System>,
}

/// TODO: Docs
pub fn handler(
    ctx: Context<AttachIdentityApproval>,
    identity_filter: IdentityFilter,
    policy: Policy,
) -> Result<()> {
    ctx.accounts
        .policy_account
        .new(ctx.accounts.policy_engine.key(), identity_filter, policy);
    ctx.accounts
        .policy_engine
        .add_policy(ctx.accounts.policy_account.key())?;
    Ok(())
}
