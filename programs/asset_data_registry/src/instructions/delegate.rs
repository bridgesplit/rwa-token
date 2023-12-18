use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateDataRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub delegate: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        seeds = [asset_mint.key().as_ref(), DataRegistry::SEED],
        bump,
    )]
    pub data_registry: Box<Account<'info, DataRegistry>>,
}

pub fn handler(ctx: Context<DelegateDataRegistry>) -> Result<()> {
    let data_registry = &mut ctx.accounts.data_registry;
    data_registry.delegate = ctx.accounts.delegate.key();
    Ok(())
}
