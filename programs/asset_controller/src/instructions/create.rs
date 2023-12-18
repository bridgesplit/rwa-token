/// creates a mint a new asset
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022};

use crate::state::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateAssetArgs {
    pub nonce: Pubkey,
    pub decimals: u8,
    pub transaction_approval_authority: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: CreateAssetArgs)]
pub struct CreateAsset<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        seeds = [args.nonce.as_ref()],
        bump,
        payer = payer,
        mint::decimals = args.decimals,
        mint::authority = authority,
        mint::freeze_authority = authority,
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = AssetControllerData::LEN,
        seeds = [asset_mint.key().as_ref(), ASSET_CONTROLLER_DATA_SEED.as_bytes()],
        bump,
        payer = payer,
    )]
    pub legal_registry: Box<Account<'info, AssetControllerData>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
    let asset_controller_data = &mut ctx.accounts.legal_registry;
    asset_controller_data.version = AssetControllerData::CURRENT_VERSION;
    asset_controller_data.asset_mint = ctx.accounts.asset_mint.key();
    asset_controller_data.transaction_approval_authority = args.transaction_approval_authority;

    Ok(())
}
