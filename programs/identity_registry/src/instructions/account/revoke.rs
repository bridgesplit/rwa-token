use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct RevokeIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [legal_registry.asset_mint.key().as_ref(), IdentityRegistry::SEED],
        bump,
        constraint = legal_registry.authority == authority.key(),
    )]
    pub legal_registry: Box<Account<'info, IdentityRegistry>>,
    #[account(
        mut,
        close = payer,
        seeds = [legal_registry.key().as_ref(), legal_account.owner.as_ref()],
        bump,
    )]
    pub legal_account: Box<Account<'info, IdentityAccount>>,
}
