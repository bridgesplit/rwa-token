use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;
use policy_engine::PolicyAccount;

use crate::{state::*, AssetControllerErrors};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct GenerateTransactionApprovalArgs {
    pub amount: Option<u64>,
    pub from: Option<Pubkey>,
    pub to: Option<Pubkey>,
}

#[derive(Accounts)]
#[instruction()]
pub struct GenerateTransactionApproval<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: checks inside the ix
    pub delegate: UncheckedAccount<'info>,
    #[account(
        mint::token_program = TOKEN22
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        signer,
        space = TransactionApprovalAccount::LEN,
        payer = payer,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    pub policy_account: Box<Account<'info, PolicyAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<GenerateTransactionApproval>,
    args: GenerateTransactionApprovalArgs,
) -> Result<()> {
    ctx.accounts.transaction_approval_account.new(
        ctx.accounts.mint.key(),
        Clock::get()?.slot,
        args.from,
        args.to,
        args.amount,
    );
    let remaining_accounts = ctx.remaining_accounts.to_vec();
    let policies = ctx.accounts.policy_account.policies;

    if remaining_accounts.len() < policies.len() {
        return Err(AssetControllerErrors::PolicyAccountsMissing.into());
    }

    // check for policy accounts and update values accordingly
    Ok(())
}
