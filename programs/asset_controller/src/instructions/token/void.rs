use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{burn, Burn, Mint, Token2022, TokenAccount},
};

use crate::TransactionApprovalAccount;

const INSTRUCTION_NAME: &str = "void_tokens";

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct VoidTokens<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account()]
    pub owner: Signer<'info>,
    #[account(
        mut,
        constraint = transaction_approval_account.amount == Some(amount)
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

pub fn handler(ctx: Context<VoidTokens>, amount: u64) -> Result<()> {
    let accounts = Burn {
        mint: ctx.accounts.asset_mint.to_account_info(),
        from: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
    burn(cpi_ctx, amount)?;
    Ok(())
}
