use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct CreateLegalRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = LegalRegistry::LEN,
        seeds = [asset_mint.key().as_ref(), LegalRegistry::SEED],
        bump,
        payer = payer,
    )]
    pub legal_registry: Box<Account<'info, LegalRegistry>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateLegalRegistry>) -> Result<()> {
    let legal_registry = &mut ctx.accounts.legal_registry;
    legal_registry.version = LegalRegistry::CURRENT_VERSION;
    legal_registry.asset_mint = ctx.accounts.asset_mint.key();
    legal_registry.authority = ctx.accounts.authority.key();
    legal_registry.delegate = ctx.accounts.authority.key();
    Ok(())
}
