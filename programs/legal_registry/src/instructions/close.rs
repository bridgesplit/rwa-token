use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct CloseLegalRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        close = payer,
        seeds = [legal_registry.asset_mint.key().as_ref(), LegalRegistry::SEED],
        bump,
    )]
    pub legal_registry: Box<Account<'info, LegalRegistry>>,
}
