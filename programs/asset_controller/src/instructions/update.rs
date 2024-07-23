/// creates a mint a new asset
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    spl_token_metadata_interface::state::Field, token_metadata_update_field, Mint, Token2022,
    TokenMetadataUpdateField,
};

use crate::state::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateAssetMetadataArgs {
    pub name: Option<String>,
    pub symbol: Option<String>,
    pub uri: Option<String>,
}

#[derive(Accounts)]
#[instruction(args: UpdateAssetMetadataArgs)]
#[event_cpi]
pub struct UpdateAssetMetadata<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        mint::token_program = token_program,
        mint::authority = authority,
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        constraint = asset_controller.authority == *authority.key,
    )]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> UpdateAssetMetadata<'info> {
    fn update_token_metadata_field(&self, field: Field, value: String) -> Result<()> {
        let cpi_accounts = TokenMetadataUpdateField {
            token_program_id: self.token_program.to_account_info(),
            metadata: self.asset_mint.to_account_info(), // metadata account is the mint, since data is stored in mint
            update_authority: self.asset_controller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        token_metadata_update_field(cpi_ctx, field, value)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<UpdateAssetMetadata>, args: UpdateAssetMetadataArgs) -> Result<()> {
    if let Some(name) = args.name.clone() {
        ctx.accounts
            .update_token_metadata_field(Field::Name, name)?;
    }

    if let Some(symbol) = args.symbol.clone() {
        ctx.accounts
            .update_token_metadata_field(Field::Symbol, symbol)?;
    }

    if let Some(uri) = args.uri.clone() {
        ctx.accounts.update_token_metadata_field(Field::Uri, uri)?;
    }

    emit_cpi!(AssetMetadataEvent {
        mint: ctx.accounts.asset_mint.key().to_string(),
        name: args.name,
        symbol: args.symbol,
        uri: args.uri,
        decimals: None,
    });

    Ok(())
}
