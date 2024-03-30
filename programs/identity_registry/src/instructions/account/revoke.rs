use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey)]
pub struct RevokeIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = identity_registry.authority == signer.key() || identity_registry.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account(
        seeds = [identity_registry.asset_mint.key().as_ref()],
        bump,
    )]
    pub identity_registry: Box<Account<'info, IdentityRegistryAccount>>,
    #[account(
        mut,
        close = payer,
        seeds = [identity_registry.key().as_ref(), identity_account.owner.as_ref()],
        bump,
        constraint = identity_account.owner == owner
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
}
