use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct CloseTitleRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        close = payer,
        seeds = [title_registry.asset_mint.key().as_ref(), TitleRegistry::SEED],
        bump,
    )]
    pub title_registry: Box<Account<'info, TitleRegistry>>,
}
