use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct ApproveTransactionArgs {
    pub from_token_account: Option<Pubkey>,
    pub to_token_account: Option<Pubkey>,
    pub amount: Option<u64>,
}

#[derive(Accounts)]
#[instruction()]
pub struct ApproveTransaction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: constraint checks
    pub signer: UncheckedAccount<'info>,
    #[account(
        mint::token_program = TOKEN22
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        payer = payer,
        space = TransactionApprovalAccount::LEN,
        seeds = [TransactionApprovalAccount::SEED.as_ref(), asset_mint.key().as_ref()],
        bump,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ApproveTransaction>, args: ApproveTransactionArgs) -> Result<()> {
    ctx.accounts.transaction_approval_account.new(
        ctx.accounts.asset_mint.key(),
        Clock::get()?.slot,
        args.from_token_account,
        args.to_token_account,
        args.amount,
    );
    Ok(())
}
