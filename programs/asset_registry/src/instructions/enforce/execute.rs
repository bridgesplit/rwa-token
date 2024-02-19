use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::{state::*, AssetRegistryErrors};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct ExecuteTransferHook<'info> {
    #[account(
        token::mint = asset_mint,
        token::authority = owner_delegate,
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub source_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        token::mint = asset_mint,
        token::token_program = anchor_spl::token_interface::spl_token_2022::id(),
    )]
    pub destination_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub owner_delegate: SystemAccount<'info>,
    /// CHECK: meta list account
    #[account(
        seeds = [META_LIST_ACCOUNT_SEED, asset_mint.key().as_ref()],
        bump,
    )]
    pub extra_metas_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
}

pub fn handler(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
    // only token22 account can call this function
    let transaction_approval_account = &mut ctx.accounts.transaction_approval_account;

    // make sure slot is same
    if transaction_approval_account.slot != Clock::get()?.slot {
        return Err(AssetRegistryErrors::TransferSlotNotApproved.into());
    }

    // make sure transfer mint is matching
    if transaction_approval_account.asset_mint != ctx.accounts.asset_mint.key() {
        return Err(AssetRegistryErrors::TransferMintNotApproved.into());
    }
    // make sure from token account is matching
    if transaction_approval_account.from_token_account != Some(ctx.accounts.source_account.key()) {
        return Err(AssetRegistryErrors::TransferFromNotApproved.into());
    }
    // make sure to token accounts is matching
    if transaction_approval_account.to_token_account != Some(ctx.accounts.destination_account.key())
    {
        return Err(AssetRegistryErrors::TransferToNotApproved.into());
    }
    // make sure amount is matching
    if transaction_approval_account.amount != Some(amount) {
        return Err(AssetRegistryErrors::TransferAmountNotApproved.into());
    }

    // remove slot to make sure it's not used again
    transaction_approval_account.slot = 0;

    Ok(())
}
