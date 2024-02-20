use crate::{state::*, IdentityRegistryErrors};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey)]
pub struct AddLevelToIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: checks inside ix
    pub signer: UncheckedAccount<'info>,
    #[account(
        seeds = [identity_registry.asset_mint.key().as_ref()],
        bump,
        constraint = identity_registry.verify_signer(identity_registry.key(), signer.key(), signer.is_signer).is_ok()
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

pub fn handler(ctx: Context<AddLevelToIdentityAccount>, _owner: Pubkey, level: u8) -> Result<()> {
    ctx.accounts.identity_account.add_level(level)?;
    Ok(())
}
