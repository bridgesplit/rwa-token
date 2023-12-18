use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct CloseTitleAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [title_registry.asset_mint.key().as_ref(), TitleRegistry::SEED],
        bump,
        constraint = title_registry.authority == authority.key(),
    )]
    pub title_registry: Box<Account<'info, TitleRegistry>>,
    #[account(
        mut,
        close = payer,
        seeds = [title_registry.key().as_ref(), title_account.nonce.as_ref()],
        bump,
    )]
    pub title_account: Box<Account<'info, TitleAccount>>,
}
