use anchor_lang::{prelude::*, solana_program::program_option::COption};
use anchor_spl::token_interface::{
    interest_bearing_mint_update_rate, InterestBearingMintUpdateRate, Mint, Token2022,
};
use rwa_utils::get_bump_in_seed_form;

use crate::AssetControllerAccount;

#[derive(Accounts)]
#[instruction()]
pub struct UpdateInterestBearingMintRate<'info> {
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = asset_mint.mint_authority == COption::Some(authority.key()),
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        seeds = [asset_mint.key().as_ref()],
        bump,
        constraint = asset_controller.authority == authority.key(),
    )]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> UpdateInterestBearingMintRate<'info> {
    fn update_interest_bearing_mint(&self, rate: i16, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let cpi_accounts = InterestBearingMintUpdateRate {
            token_program_id: self.token_program.to_account_info(),
            mint: self.asset_mint.to_account_info(),
            rate_authority: self.asset_controller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        interest_bearing_mint_update_rate(cpi_ctx, rate)?;
        Ok(())
    }
}
pub fn handler(ctx: Context<UpdateInterestBearingMintRate>, rate: i16) -> Result<()> {
    let asset_mint = ctx.accounts.asset_mint.key();
    let signer_seeds = [
        asset_mint.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.asset_controller),
    ];
    ctx.accounts
        .update_interest_bearing_mint(rate, &[&signer_seeds])?;
    
    Ok(())
}
