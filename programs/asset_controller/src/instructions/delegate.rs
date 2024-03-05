use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;
/// Represents a delegate asset instruction and its associated accounts.
/// This instruction allows the authority to delegate an asset to another entity.
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
