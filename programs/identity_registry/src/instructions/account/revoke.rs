use crate::{state::*, IdentityRegistryErrors};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey)]
pub struct RevokeIdentityAccount<'info> {
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
        close = payer,
        seeds = [identity_registry.key().as_ref(), identity_account.owner.as_ref()],
        bump,
        constraint = identity_account.owner == owner
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
}

pub fn handler(ctx: Context<RevokeIdentityAccount>, _owner: Pubkey) -> Result<()> {
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
    Ok(())
}
