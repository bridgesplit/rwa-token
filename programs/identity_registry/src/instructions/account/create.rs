use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey, level: u8)]
pub struct CreateIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = identity_registry.authority == signer.key() || identity_registry.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account()]
    pub identity_registry: Box<Account<'info, IdentityRegistryAccount>>,
    #[account(
        init,
        space = 8 + IdentityAccount::INIT_SPACE,
        seeds = [identity_registry.key().as_ref(), owner.as_ref()],
        bump,
        payer = payer,
        constraint = level != 0,
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateIdentityAccount>, owner: Pubkey, level: u8) -> Result<()> {
    ctx.accounts
        .identity_account
        .new(owner, ctx.accounts.identity_registry.key(), level);
    Ok(())
}
