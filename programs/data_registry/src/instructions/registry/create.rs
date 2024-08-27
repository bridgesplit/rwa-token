use crate::state::*;
use anchor_lang::{prelude::*, solana_program::program_option::COption};
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct CreateDataRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = asset_mint.mint_authority == COption::Some(signer.key()),
    )]
    pub signer: Signer<'info>,
    #[account()]
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
    ctx.accounts
        .data_registry
        .new(ctx.accounts.asset_mint.key(), authority, delegate);
    Ok(())
}
