use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct CloseDataRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        close = payer,
        seeds = [data_registry.asset_mint.key().as_ref(), DataRegistry::SEED],
        bump,
    )]
    pub data_registry: Box<Account<'info, DataRegistry>>,
}
