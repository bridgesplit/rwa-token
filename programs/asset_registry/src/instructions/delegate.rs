use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;

#[derive(Accounts)]
#[instruction(delegate: Pubkey)]
pub struct CreateAsset<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = authority.key() == asset_registry.authority
    )]
    pub authority: Signer<'info>,
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        seeds = [asset_registry.asset_mint.as_ref()],
        bump,
    )]
    pub asset_registry: Box<Account<'info, AssetRegistryAccount>>,
}

pub fn handler(ctx: Context<CreateAsset>, delegate: Pubkey) -> Result<()> {
    ctx.accounts.asset_registry.delegate = delegate;
    Ok(())
}
