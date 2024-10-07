use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(level: u8)]
pub struct RemoveLevelFromIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = identity_registry.authority == signer.key() || identity_registry.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account()]
    pub identity_registry: Box<Account<'info, IdentityRegistryAccount>>,
    #[account(
        mut,
        seeds = [identity_registry.key().as_ref(), identity_account.owner.as_ref()],
        bump,
        realloc = identity_account.to_account_info().data_len() - 1, // u8
        realloc::zero = false,
        realloc::payer = payer,
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
    #[account(
        mut,
        seeds = [&[level], identity_account.identity_registry.as_ref()],
        bump,
    )]
    pub limit_account: Box<Account<'info, IdentityMetadataAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RemoveLevelFromIdentityAccount>, level: u8) -> Result<()> {
    ctx.accounts.identity_account.remove_level(level)?;
    ctx.accounts.limit_account.remove_user()?;
    Ok(())
}
