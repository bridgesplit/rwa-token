use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct RemovePolicy<'info> {
    #[account()]
    pub payer: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = policy_engine.authority == authority.key(),
    )]
    pub policy_engine: Box<Account<'info, PolicyEngineAccount>>,
    #[account(
        mut,
        close = payer,
        constraint = policy_account.policy_engine == policy_engine.key(),
    )]
    pub policy_account: Box<Account<'info, PolicyAccount>>,
}
