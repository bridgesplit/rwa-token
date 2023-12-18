use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct CreateTitleRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = TitleRegistry::LEN,
        seeds = [asset_mint.key().as_ref(), TitleRegistry::SEED],
        bump,
        payer = payer,
    )]
    pub title_registry: Box<Account<'info, TitleRegistry>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateTitleRegistry>) -> Result<()> {
    let title_registry = &mut ctx.accounts.title_registry;
    title_registry.version = TitleRegistry::CURRENT_VERSION;
    title_registry.asset_mint = ctx.accounts.asset_mint.key();
    title_registry.authority = ctx.accounts.authority.key();
    title_registry.auditor = ctx.accounts.authority.key();
    title_registry.delegate = ctx.accounts.authority.key();
    Ok(())
}
