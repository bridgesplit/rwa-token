use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct AttachAlwaysRequireApproval<'info> {
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
        space = AlwaysRequireApproval::LEN,
        payer = payer,
    )]
    pub policy_account: Box<Account<'info, AlwaysRequireApproval>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AttachAlwaysRequireApproval>,
    identity_filter: IdentityFilter,
) -> Result<()> {
    ctx.accounts.policy_account.new(identity_filter);
    ctx.accounts
        .policy_registry
        .add_policy(ctx.accounts.policy_account.key())?;
    Ok(())
}
