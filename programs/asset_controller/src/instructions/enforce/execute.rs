use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::{state::*, AssetControllerErrors};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct ExecuteTransferHook<'info> {
    #[account(
        token::mint = mint,
        token::authority = owner_delegate,
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub source_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        token::mint = mint,
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub destination_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub owner_delegate: SystemAccount<'info>,
    /// CHECK: meta list account
    #[account(
        seeds = [META_LIST_ACCOUNT_SEED, mint.key().as_ref()],
        bump,
    )]
    pub extra_metas_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub approve_account: Box<Account<'info, TransactionApprovalAccount>>,
}

pub fn handler(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
    // only token22 account can call this function
    let approve_account = &mut ctx.accounts.approve_account;

    // make sure transfer mint is matching
    if approve_account.mint != ctx.accounts.mint.key() {
        return Err(AssetControllerErrors::TransferMintNotApproved.into());
    }
    // make sure from token account is matching
    if approve_account.from != Some(ctx.accounts.source_account.key()) {
        return Err(AssetControllerErrors::TransferFromNotApproved.into());
    }
    // make sure to token accounts is matching
    if approve_account.to != Some(ctx.accounts.destination_account.key()) {
        return Err(AssetControllerErrors::TransferToNotApproved.into());
    }
    // make sure amount is matching
    if approve_account.amount != Some(amount) {
        return Err(AssetControllerErrors::TransferAmountNotApproved.into());
    }
   
    Ok(())
}
