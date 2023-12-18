use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, Token2022, TokenAccount, TransferChecked},
};

use crate::TransactionApprovalAccount;

const INSTRUCTION_NAME: &str = "transfer_tokens";

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct TransferTokens<'info> {
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
        constraint = transaction_approval_account.amount == Some(amount),
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

pub fn handler(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
    let accounts = TransferChecked {
        from: ctx.accounts.asset_mint.to_account_info(),
        to: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
        mint: ctx.accounts.asset_mint.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
    transfer_checked(cpi_ctx, amount, ctx.accounts.asset_mint.decimals)?;
    Ok(())
}
