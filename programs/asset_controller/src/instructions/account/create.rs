use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, Token2022, TokenAccount},
};

use crate::{TrackerAccount, TransactionApprovalAccount};

#[derive(Accounts)]
#[instruction()]
pub struct CreateTokenAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: can be any account
    pub owner: UncheckedAccount<'info>,
    #[account(
        mut,
        close = payer,
        constraint = transaction_approval_account.asset_mint == asset_mint.key(),
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    #[account(
        mint::token_program = token_program,
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        payer = payer,
        associated_token::token_program = token_program,
        associated_token::mint = asset_mint,
        associated_token::authority = owner,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        init,
        space = TrackerAccount::LEN,
        seeds = [asset_mint.key().as_ref(), owner.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub tracker_account: Box<Account<'info, TrackerAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handler(ctx: Context<CreateTokenAccount>) -> Result<()> {
    ctx.accounts
        .tracker_account
        .new(ctx.accounts.asset_mint.key(), ctx.accounts.owner.key());
    Ok(())
}
