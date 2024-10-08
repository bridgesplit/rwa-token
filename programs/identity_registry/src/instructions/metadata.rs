use std::u64;

use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(level: u8)]
pub struct EditIdentityMetadata<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = identity_registry.authority == signer.key() || identity_registry.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account()]
    pub identity_registry: Box<Account<'info, IdentityRegistryAccount>>,
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + IdentityMetadataAccount::INIT_SPACE,
        seeds = [&[level], identity_registry.key().as_ref()],
        bump,
    )]
    pub identity_metadata_account: Box<Account<'info, IdentityMetadataAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<EditIdentityMetadata>,
    level: u8,
    max_allowed: Option<u64>,
) -> Result<()> {
    let max_allowed = max_allowed.unwrap_or(u64::MAX);
    // init limit account if level is not present
    if ctx.accounts.identity_metadata_account.level == 0 {
        ctx.accounts.identity_metadata_account.new(
            ctx.accounts.identity_registry.key(),
            level,
            max_allowed,
        );
    }
    Ok(())
}
