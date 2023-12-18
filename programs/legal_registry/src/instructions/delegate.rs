use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateLegalRegistry<'info> {
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
        seeds = [asset_mint.key().as_ref(), LegalRegistry::SEED],
        bump,
    )]
    pub legal_registry: Box<Account<'info, LegalRegistry>>,
}

pub fn handler(ctx: Context<DelegateLegalRegistry>) -> Result<()> {
    let legal_registry = &mut ctx.accounts.legal_registry;
    legal_registry.delegate = ctx.accounts.delegate.key();
    Ok(())
}
