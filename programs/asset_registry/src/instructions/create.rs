/// creates a mint a new asset
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022};

use crate::state::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateAssetArgs {
    pub nonce: Pubkey,
    pub decimals: u8,
    pub authority: Pubkey,
    pub delegate: Option<Pubkey>,
}

#[derive(Accounts)]
#[instruction(args: CreateAssetArgs)]
pub struct CreateAsset<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        seeds = [args.nonce.as_ref()],
        bump,
        payer = payer,
        mint::decimals = args.decimals,
        mint::authority = args.authority,
        mint::freeze_authority = args.authority,
        mint::token_program = token_program
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = AssetRegistryAccount::LEN,
        seeds = [asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub asset_registry: Box<Account<'info, AssetRegistryAccount>>,
    #[account(
        init_if_needed,
        space = 1,
        seeds = [META_LIST_ACCOUNT_SEED, asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub extra_metas_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
    let delegate = match args.delegate {
        Some(delegate) => delegate,
        None => ctx.accounts.asset_registry.key(),
    };
    ctx.accounts
        .asset_registry
        .new(ctx.accounts.asset_mint.key(), args.authority, delegate);

    Ok(())
}
