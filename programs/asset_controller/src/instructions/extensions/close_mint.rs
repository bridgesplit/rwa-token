use anchor_lang::{prelude::*, solana_program::program_option::COption};
use anchor_spl::{
    token_2022::{close_account, CloseAccount},
    token_interface::{Mint, Token2022},
};
use rwa_utils::get_bump_in_seed_form;

use crate::AssetControllerAccount;

#[derive(Accounts)]
#[instruction()]
pub struct CloseMintAccount<'info> {
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = asset_mint.mint_authority == COption::Some(authority.key()),
        constraint = asset_mint.supply == 0,
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

impl<'info> CloseMintAccount<'info> {
    fn close_mint_account(&self, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let cpi_accounts = CloseAccount {
            account: self.asset_mint.to_account_info(),
            destination: self.authority.to_account_info(),
            authority: self.asset_controller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        close_account(cpi_ctx)?;
        Ok(())
    }
}
pub fn handler(ctx: Context<CloseMintAccount>) -> Result<()> {
    let asset_mint = ctx.accounts.asset_mint.key();
    let signer_seeds = [
        asset_mint.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.asset_controller),
    ];
    ctx.accounts.close_mint_account(&[&signer_seeds])?;
    Ok(())
}
