use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CreatePolicyAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = policy_engine.authority == signer.key() || policy_engine.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account(mut)]
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
    let policy_account_address = ctx.accounts.policy_account.key();
    ctx.accounts.policy_account.new(
        policy_account_address,
        ctx.accounts.policy_engine.key(),
        identity_filter,
        policy_type,
    );
    Ok(())
}
