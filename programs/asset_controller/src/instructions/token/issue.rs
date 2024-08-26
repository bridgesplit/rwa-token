use anchor_lang::prelude::*;
use anchor_spl::token_interface::{mint_to, Mint, MintTo, Token2022, TokenAccount};
use rwa_utils::get_bump_in_seed_form;

use crate::AssetControllerAccount;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct IssueTokensArgs {
    pub amount: u64,
    pub to: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: IssueTokensArgs)]
pub struct IssueTokens<'info> {
    #[account()]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        seeds = [asset_mint.key().as_ref()],
        bump,
        constraint = asset_controller.authority == authority.key(),
    )]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
    #[account(
        mut,
        associated_token::token_program = token_program,
        associated_token::mint = asset_mint,
        associated_token::authority = args.to,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> IssueTokens<'info> {
    fn issue_tokens(&self, amount: u64, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let accounts = MintTo {
            mint: self.asset_mint.to_account_info(),
            to: self.token_account.to_account_info(),
            authority: self.asset_controller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            accounts,
            signer_seeds,
        );
        mint_to(cpi_ctx, amount)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<IssueTokens>, args: IssueTokensArgs) -> Result<()> {
    let asset_mint = ctx.accounts.asset_mint.key();
    let signer_seeds = [
        asset_mint.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.asset_controller),
    ];
    ctx.accounts.issue_tokens(args.amount, &[&signer_seeds])?;
    Ok(())
}
