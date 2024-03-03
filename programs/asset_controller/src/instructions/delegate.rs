use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;

#[derive(Accounts)]
#[instruction(delegate: Pubkey)]
pub struct DelegateAsset<'info> {
    #[account(
        constraint = authority.key() == asset_controller.authority
    )]
    pub authority: Signer<'info>,
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut)]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
}

pub fn handler(ctx: Context<DelegateAsset>, delegate: Pubkey) -> Result<()> {
    ctx.accounts.asset_controller.delegate = delegate;
    Ok(())
}
