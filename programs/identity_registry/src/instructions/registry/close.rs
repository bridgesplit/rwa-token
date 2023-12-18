use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct CloseIdentityRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        close = payer,
        seeds = [legal_registry.asset_mint.key().as_ref()],
        bump,
        constraint = legal_registry.authority == authority.key(),
    )]
    pub legal_registry: Box<Account<'info, IdentityRegistry>>,
}
