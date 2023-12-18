use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct CreateIdentityRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = IdentityRegistry::LEN,
        seeds = [asset_mint.key().as_ref(), IdentityRegistry::SEED],
        bump,
        payer = payer,
    )]
    pub legal_registry: Box<Account<'info, IdentityRegistry>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateIdentityRegistry>) -> Result<()> {
    let legal_registry = &mut ctx.accounts.legal_registry;
    legal_registry.version = IdentityRegistry::CURRENT_VERSION;
    legal_registry.asset_mint = ctx.accounts.asset_mint.key();
    legal_registry.authority = ctx.accounts.authority.key();
    legal_registry.delegate = ctx.accounts.authority.key();
    Ok(())
}
