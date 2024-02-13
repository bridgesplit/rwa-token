use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CreatePolicyAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: can be any account
    #[account()]
    pub owner: UncheckedAccount<'info>,
    #[account()]
    pub policy_registry: Box<Account<'info, PolicyRegistry>>,
    #[account(
        init,
        space = PolicyAccount::LEN,
        seeds = [policy_registry.key().as_ref(), owner.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub policy_account: Box<Account<'info, PolicyAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreatePolicyAccount>) -> Result<()> {
    ctx.accounts
        .policy_account
        .new(ctx.accounts.policy_registry.key(), ctx.accounts.owner.key());

    Ok(())
}
