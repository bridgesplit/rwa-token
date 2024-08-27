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
use data_registry::{
    cpi::{accounts::CreateDataRegistry, create_data_registry},
    program::DataRegistry,
};
use identity_registry::{
    cpi::{accounts::CreateIdentityRegistry, create_identity_registry},
    program::IdentityRegistry,
};
use policy_engine::{
    cpi::{accounts::CreatePolicyEngine, create_policy_engine},
    program::PolicyEngine,
};
use rwa_utils::get_bump_in_seed_form;

use crate::{state::*, update_account_lamports_to_minimum_balance};

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
        payer = payer,
        space = 8 + AssetControllerAccount::INIT_SPACE,
        seeds = [asset_mint.key().as_ref()],
        bump,
    )]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
    #[account(
        init,
        signer,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = args.decimals,
        mint::authority = asset_controller.key(),
        mint::freeze_authority = asset_controller.key(),
        extensions::permanent_delegate::delegate = asset_controller.key(),
        extensions::transfer_hook::authority = asset_controller.key(),
        extensions::transfer_hook::program_id = policy_engine::id(),
        extensions::group_member_pointer::authority = asset_controller.key(),
        extensions::group_member_pointer::member_address = asset_mint.key(),
        extensions::group_pointer::authority = asset_controller.key(),
        extensions::group_pointer::group_address = asset_mint.key(),
        extensions::metadata_pointer::authority = asset_controller.key(),
        extensions::metadata_pointer::metadata_address = asset_mint.key(),
        extensions::interest_bearing_mint::authority = asset_controller.key(),
        extensions::interest_bearing_mint::rate = args.interest_rate.unwrap_or(0),
        extensions::close_authority::authority = asset_controller.key(),
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub extra_metas_account: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    #[account(mut)]
    pub policy_engine_account: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    #[account(mut)]
    pub identity_registry_account: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    #[account(mut)]
    pub data_registry_account: UncheckedAccount<'info>,
    pub policy_engine: Program<'info, PolicyEngine>,
    pub identity_registry: Program<'info, IdentityRegistry>,
    pub data_registry: Program<'info, DataRegistry>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> CreateAssetController<'info> {
    fn initialize_token_metadata(
        &self,
        name: String,
        symbol: String,
        uri: String,
        signer_seeds: &[&[&[u8]]],
    ) -> Result<()> {
        let cpi_accounts = TokenMetadataInitialize {
            program_id: self.token_program.to_account_info(),
            mint: self.asset_mint.to_account_info(),
            metadata: self.asset_mint.to_account_info(), // metadata account is the mint, since data is stored in mint
            mint_authority: self.asset_controller.to_account_info(),
            update_authority: self.asset_controller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token_metadata_initialize(cpi_ctx, name, symbol, uri)?;
        Ok(())
    }

    fn create_policy_engine(
        &self,
        delegate: Option<Pubkey>,
        signer_seeds: &[&[&[u8]]],
    ) -> Result<()> {
        let cpi_accounts = CreatePolicyEngine {
            payer: self.payer.to_account_info(),
            signer: self.asset_controller.to_account_info(),
            asset_mint: self.asset_mint.to_account_info(),
            extra_metas_account: self.extra_metas_account.to_account_info(),
            policy_engine_account: self.policy_engine_account.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.policy_engine.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        create_policy_engine(cpi_ctx, self.authority.key(), delegate)?;
        Ok(())
    }

    fn create_identity_registry(
        &self,
        delegate: Option<Pubkey>,
        signer_seeds: &[&[&[u8]]],
    ) -> Result<()> {
        let cpi_accounts = CreateIdentityRegistry {
            payer: self.payer.to_account_info(),
            signer: self.asset_controller.to_account_info(),
            asset_mint: self.asset_mint.to_account_info(),
            identity_registry_account: self.identity_registry_account.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.identity_registry.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        create_identity_registry(cpi_ctx, self.authority.key(), delegate)?;
        Ok(())
    }

    fn create_data_registry(
        &self,
        delegate: Option<Pubkey>,
        signer_seeds: &[&[&[u8]]],
    ) -> Result<()> {
        let cpi_accounts = CreateDataRegistry {
            payer: self.payer.to_account_info(),
            signer: self.asset_controller.to_account_info(),
            asset_mint: self.asset_mint.to_account_info(),
            data_registry: self.data_registry_account.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.data_registry.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        create_data_registry(cpi_ctx, self.authority.key(), delegate)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<CreateAssetController>, args: CreateAssetControllerArgs) -> Result<()> {
    ctx.accounts.asset_controller.new(
        ctx.accounts.asset_mint.key(),
        ctx.accounts.authority.key(),
        args.delegate,
    );
    let asset_mint = ctx.accounts.asset_mint.key();

    let signer_seeds = [
        asset_mint.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.asset_controller),
    ];

    // initialize token metadata
    ctx.accounts.initialize_token_metadata(
        args.name.clone(),
        args.symbol.clone(),
        args.uri.clone(),
        &[&signer_seeds],
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

    // create policy registry
    ctx.accounts
        .create_policy_engine(args.delegate, &[&signer_seeds])?;

    // create identity registry
    ctx.accounts
        .create_identity_registry(args.delegate, &[&signer_seeds])?;

    // create data registry
    ctx.accounts
        .create_data_registry(args.delegate, &[&signer_seeds])?;

    Ok(())
}
