use crate::{state::*, IdentityRegistryErrors};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey)]
pub struct AddLevelIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: checks inside ix
    pub signer: UncheckedAccount<'info>,
    #[account(
        seeds = [identity_registry.asset_mint.key().as_ref()],
        bump,
    )]
    pub identity_registry: Box<Account<'info, IdentityRegistry>>,
    #[account(
        mut,
        seeds = [identity_registry.key().as_ref(), owner.as_ref()],
        bump,
        constraint = identity_account.owner == owner,
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddLevelIdentityAccount>, _owner: Pubkey, level: u8) -> Result<()> {
    // confirm signer is either authority or signer
    ctx.accounts
        .identity_registry
        .check_authority(ctx.accounts.signer.key())?;
    if ctx.accounts.signer.key() == ctx.accounts.identity_registry.key() {
        // signer not required
    } else {
        if !ctx.accounts.signer.is_signer {
            return Err(IdentityRegistryErrors::UnauthorizedSigner.into());
        }
    }
    ctx.accounts.identity_account.add_level(level)?;
    Ok(())
}
