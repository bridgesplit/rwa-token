/// creates a mint a new asset
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022};
use spl_tlv_account_resolution::state::ExtraAccountMetaList;
use spl_transfer_hook_interface::instruction::ExecuteInstruction;

use crate::{get_extra_account_metas, get_meta_list_size, state::*};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateAssetControllerArgs {
    pub decimals: u8,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub delegate: Option<Pubkey>,
}

#[derive(Accounts)]
#[instruction(args: CreateAssetControllerArgs)]
pub struct CreateAssetController<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: can be any account
    pub authority: UncheckedAccount<'info>,
    #[account(
        init,
        signer,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = args.decimals,
        mint::authority = authority,
        mint::freeze_authority = authority,
        extensions::transfer_hook::authority = asset_controller.key(),
        extensions::transfer_hook::program_id = crate::id(),
        extensions::metadata_pointer::authority = asset_controller.key(),
        extensions::metadata_pointer::metadata_address = asset_mint.key(),
        extensions::group_member_pointer::authority = asset_controller.key(),
        extensions::group_member_pointer::member_address = asset_mint.key(),
        extensions::group_pointer::authority = asset_controller.key(),
        extensions::group_pointer::group_address = asset_mint.key(),
        extensions::permanent_delegate::delegate = asset_controller.key(),
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        payer = payer,
        space = 8 + AssetControllerAccount::INIT_SPACE,
        seeds = [asset_mint.key().as_ref()],
        bump,
    )]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
    #[account(
        init,
        space = get_meta_list_size()?,
        seeds = [META_LIST_ACCOUNT_SEED, asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    /// CHECK: extra metas account
    pub extra_metas_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> CreateAssetController<'info> {
    // fn initialize_token_metadata(&self, name: String, symbol: String, uri: String) -> Result<()> {
    //     let cpi_accounts = TokenMetadataInitialize {
    //         token_program_id: self.token_program.to_account_info(),
    //         mint: self.asset_mint.to_account_info(),
    //         metadata: self.asset_mint.to_account_info(), // metadata account is the mint, since data is stored in mint
    //         mint_authority: self.authority.to_account_info(),
    //         update_authority: self.asset_controller.to_account_info(),
    //     };
    //     let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
    //     token_metadata_initialize(cpi_ctx, name, symbol, uri)?;
    //     Ok(())
    // }
}

pub fn handler(ctx: Context<CreateAssetController>, args: CreateAssetControllerArgs) -> Result<()> {
    ctx.accounts.asset_controller.new(
        ctx.accounts.asset_mint.key(),
        ctx.accounts.authority.key(),
        args.delegate,
    );

    // initialize the extra metas account
    let extra_metas_account = &ctx.accounts.extra_metas_account;
    let metas = get_extra_account_metas()?;
    let mut data = extra_metas_account.try_borrow_mut_data()?;
    ExtraAccountMetaList::init::<ExecuteInstruction>(&mut data, &metas)?;

    // // initialize token metadata
    // ctx.accounts
    //     .initialize_token_metadata(args.name, args.symbol, args.uri)?;

    // // transfer minimum rent to mint account
    // update_account_lamports_to_minimum_balance(
    //     ctx.accounts.asset_mint.to_account_info(),
    //     ctx.accounts.payer.to_account_info(),
    //     ctx.accounts.system_program.to_account_info(),
    // )?;

    Ok(())
}
