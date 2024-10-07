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

pub fn handler(ctx: Context<CreateIdentityAccount>, owner: Pubkey, level: u8) -> Result<()> {
    // init limit account if level is not present
    if ctx.accounts.identity_metadata_account.level == 0 {
        ctx.accounts.identity_metadata_account.new(
            ctx.accounts.identity_registry.key(),
            level,
            u64::MAX,
        );
    }
    ctx.accounts.identity_account.add_level(level)?;
    ctx.accounts
        .identity_account
        .new(owner, ctx.accounts.identity_registry.key(), level);
    Ok(())
}
