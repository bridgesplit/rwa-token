use crate::{state::*, TOKEN22};
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct CreateDataRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mint::token_program = TOKEN22,
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = 8 + DataRegistryAccount::INIT_SPACE,
        seeds = [asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateDataRegistry>,
    authority: Pubkey,
    delegate: Option<Pubkey>,
) -> Result<()> {
    let registry_address = ctx.accounts.data_registry.key();
    ctx.accounts.data_registry.new(
        registry_address,
        ctx.accounts.asset_mint.key(),
        authority,
        delegate,
    );
    Ok(())
}
