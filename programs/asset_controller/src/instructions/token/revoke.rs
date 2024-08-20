use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{transfer_checked, TransferChecked},
    token_interface::{Mint, Token2022, TokenAccount},
};
use rwa_utils::get_bump_in_seed_form;

#[derive(Accounts)]
#[instruction()]
pub struct RevokeTokens<'info> {
    #[account()]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        seeds = [asset_mint.key().as_ref()],
        bump,
        constraint = asset_controller.authority == authority.key()
    )]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
    #[account(mut)]
    pub authority_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub revoke_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> RevokeTokens<'info> {
    fn revoke_tokens(&self, amount: u64, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let accounts = TransferChecked {
            mint: self.asset_mint.to_account_info(),
            authority: self.asset_controller.to_account_info(),
            from: self.revoke_token_account.to_account_info(),
            to: self.authority_token_account.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            accounts,
            &signer_seeds,
        );
        transfer_checked(cpi_ctx, amount, self.asset_mint.decimals)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<RevokeTokens>, amount: u64) -> Result<()> {
    let asset_mint = ctx.accounts.asset_mint.key();
    let signer_seeds = [
        asset_mint.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.asset_controller),
    ];
    ctx.accounts.revoke_tokens(amount, &[&signer_seeds])?;
    Ok(())
}
