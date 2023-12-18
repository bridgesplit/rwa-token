use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateTitleRegistry<'info> {
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
        seeds = [asset_mint.key().as_ref(), TitleRegistry::SEED],
        bump,
    )]
    pub title_registry: Box<Account<'info, TitleRegistry>>,
}

pub fn handler(ctx: Context<DelegateTitleRegistry>) -> Result<()> {
    let title_registry = &mut ctx.accounts.title_registry;
    title_registry.delegate = ctx.accounts.delegate.key();
    Ok(())
}
