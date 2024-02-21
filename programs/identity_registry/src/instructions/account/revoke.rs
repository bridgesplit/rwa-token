use crate::state::*;
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
        constraint = identity_registry.verify_signer(identity_registry.key(), signer.key(), signer.is_signer).is_ok()
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
