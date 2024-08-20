/// creates a mint a new asset
use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::spl_token_2022::extension::{
        interest_bearing_mint::InterestBearingConfig, ExtensionType,
    },
    token_interface::{
        get_mint_extension_data, token_metadata_initialize, Mint, Token2022,
        TokenMetadataInitialize,
    },
};
use spl_tlv_account_resolution::state::ExtraAccountMetaList;
use spl_transfer_hook_interface::instruction::ExecuteInstruction;

use crate::{
    get_extra_account_metas, get_meta_list_size, state::*,
    update_account_lamports_to_minimum_balance,
};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateAssetControllerArgs {
    pub decimals: u8,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub delegate: Option<Pubkey>,
    pub interest_rate: Option<i16>,
}

#[derive(Accounts)]
#[instruction(args: CreateAssetControllerArgs)]
#[event_cpi]
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
        mint::freeze_authority = asset_controller.key(),
        extensions::transfer_hook::authority = asset_controller.key(),
        extensions::transfer_hook::program_id = crate::id(),
        extensions::group_member_pointer::authority = asset_controller.key(),
        extensions::group_member_pointer::member_address = asset_mint.key(),
        extensions::group_pointer::authority = asset_controller.key(),
        extensions::group_pointer::group_address = asset_mint.key(),
        extensions::metadata_pointer::authority = asset_controller.key(),
        extensions::metadata_pointer::metadata_address = asset_mint.key(),
        extensions::permanent_delegate::delegate = asset_controller.key(),
        extensions::interest_bearing_mint::authority = asset_controller.key(),
        extensions::interest_bearing_mint::rate = args.interest_rate.unwrap_or(0),
        extensions::close_authority::authority = asset_controller.key(),
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
    fn initialize_token_metadata(&self, name: String, symbol: String, uri: String) -> Result<()> {
        let cpi_accounts = TokenMetadataInitialize {
            token_program_id: self.token_program.to_account_info(),
            mint: self.asset_mint.to_account_info(),
            metadata: self.asset_mint.to_account_info(), // metadata account is the mint, since data is stored in mint
            mint_authority: self.authority.to_account_info(),
            update_authority: self.asset_controller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        token_metadata_initialize(cpi_ctx, name, symbol, uri)?;
        Ok(())
    }
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

    // initialize token metadata
    ctx.accounts.initialize_token_metadata(
        args.name.clone(),
        args.symbol.clone(),
        args.uri.clone(),
    )?;

    // transfer minimum rent to mint account
    update_account_lamports_to_minimum_balance(
        ctx.accounts.asset_mint.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    emit_cpi!(AssetMetadataEvent {
        mint: ctx.accounts.asset_mint.key().to_string(),
        name: Some(args.name),
        symbol: Some(args.symbol),
        uri: Some(args.uri),
        decimals: Some(args.decimals),
    });

    let extension_metadata = get_mint_extension_data::<InterestBearingConfig>(
        &ctx.accounts.asset_mint.to_account_info(),
    )?;

    emit_cpi!(ExtensionMetadataEvent {
        address: ctx.accounts.asset_mint.key().to_string(),
        extension_type: ExtensionType::InterestBearingConfig as u8,
        metadata: serde_json::to_vec(&extension_metadata)
            .map_err(|_| ProgramError::InvalidAccountData)?,
    });

    Ok(())
}
