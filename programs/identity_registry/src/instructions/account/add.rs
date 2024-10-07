use std::u64;

use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(level: u8)]
pub struct AddLevelToIdentityAccount<'info> {
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
        realloc = identity_account.to_account_info().data_len() + 1, // u8
        realloc::zero = false,
        realloc::payer = payer,
        constraint = level != 0,
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + IdentityMetadataAccount::INIT_SPACE,
        seeds = [&[level], identity_account.identity_registry.as_ref()],
        bump,
    )]
    pub limit_account: Box<Account<'info, IdentityMetadataAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddLevelToIdentityAccount>, level: u8) -> Result<()> {
    // init limit account if level is not present
    if ctx.accounts.limit_account.level == 0 {
        ctx.accounts
            .limit_account
            .new(ctx.accounts.identity_registry.key(), level, u64::MAX);
    }
    ctx.accounts.identity_account.add_level(level)?;
    ctx.accounts.limit_account.add_user()?;
    Ok(())
}
