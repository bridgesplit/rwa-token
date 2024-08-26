use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{burn, Burn},
    token_interface::{Mint, Token2022, TokenAccount},
};
use rwa_utils::get_bump_in_seed_form;
use spl_token_2022::instruction::transfer_checked;
use spl_transfer_hook_interface::onchain::add_extra_accounts_for_execute_cpi;

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
    #[account(mut)]
    pub revoke_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> RevokeTokens<'info> {
    fn transfer_tokens(
        &self,
        amount: u64,
        signer_seeds: &[&[&[u8]]],
        remaining_accounts: &[AccountInfo<'info>],
    ) -> Result<()> {
        let mut ix = transfer_checked(
            self.token_program.key,
            &self.revoke_token_account.key(),
            &self.asset_mint.key(),
            &self.authority_token_account.key(),
            &self.asset_controller.key(),
            &[],
            amount,
            self.asset_mint.decimals,
        )?;

        let mut account_infos = vec![
            self.revoke_token_account.to_account_info(),
            self.asset_mint.to_account_info(),
            self.authority_token_account.to_account_info(),
            self.asset_controller.to_account_info(),
        ];

        add_extra_accounts_for_execute_cpi(
            &mut ix,
            &mut account_infos,
            &crate::ID,
            self.revoke_token_account.to_account_info(),
            self.asset_mint.to_account_info(),
            self.authority_token_account.to_account_info(),
            self.asset_controller.to_account_info(),
            amount,
            remaining_accounts,
        )?;

        anchor_lang::solana_program::program::invoke_signed(&ix, &account_infos, signer_seeds)
            .map_err(Into::into)
    }

    fn burn_tokens(&self, amount: u64, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let accounts = Burn {
            mint: self.asset_mint.to_account_info(),
            authority: self.asset_controller.to_account_info(),
            from: self.authority_token_account.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            accounts,
            signer_seeds,
        );
        burn(cpi_ctx, amount)?;
        Ok(())
    }
}

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, RevokeTokens<'info>>,
    amount: u64,
) -> Result<()> {
    let asset_mint = ctx.accounts.asset_mint.key();
    let signer_seeds = [
        asset_mint.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.asset_controller),
    ];
    ctx.accounts
        .transfer_tokens(amount, &[&signer_seeds], ctx.remaining_accounts)?;
    ctx.accounts.burn_tokens(amount, &[&signer_seeds])?;
    Ok(())
}
