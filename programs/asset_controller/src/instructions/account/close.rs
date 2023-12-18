use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, Token2022, TokenAccount},
};

use crate::TransactionApprovalAccount;

const INSTRUCTION_NAME: &str = "close_token_account";

#[derive(Accounts)]
#[instruction()]
pub struct CloseTokenAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account()]
    pub owner: Signer<'info>,
    #[account(
        mut,
        constraint = transaction_approval_account.owner == owner.key(),
        constraint = transaction_approval_account.asset_mint == asset_mint.key(),
        constraint = transaction_approval_account.instruction_name == INSTRUCTION_NAME,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    #[account()]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = asset_mint,
        associated_token::authority = owner,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handler(ctx: Context<CloseTokenAccount>) -> Result<()> {
    ctx.accounts
        .token_account
        .close(ctx.accounts.authority.to_account_info())?;
    Ok(())
}
