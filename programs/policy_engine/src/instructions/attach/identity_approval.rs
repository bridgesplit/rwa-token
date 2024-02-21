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
        seeds = [policy_engine.asset_mint.as_ref()],
        bump,
        constraint = policy_engine.verify_signer(policy_engine.key(), signer.key(), signer.is_signer).is_ok()
    )]
    pub policy_engine: Box<Account<'info, PolicyEngine>>,
    #[account(
        init,
        signer,
        space = IdentityApproval::LEN,
        payer = payer,
    )]
    pub policy: Box<Account<'info, IdentityApproval>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AttachIdentityApproval>,
    identity_filter: IdentityFilter,
) -> Result<()> {
    ctx.accounts.policy.new(identity_filter);
    ctx.accounts
        .policy_engine
        .add_policy(ctx.accounts.policy.key())?;
    Ok(())
}
