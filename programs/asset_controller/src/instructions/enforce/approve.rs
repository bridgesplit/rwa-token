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
    #[account(constraint = asset_controller.verify_signer(asset_controller.key(), signer.key(), signer.is_signer).is_ok())]
    pub signer: UncheckedAccount<'info>,
    #[account(
        mint::token_program = TOKEN22
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        payer = payer,
        space = 8 + TransactionApprovalAccount::INIT_SPACE,
        seeds = [TransactionApprovalAccount::SEED.as_ref(), asset_mint.key().as_ref()],
        bump,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    #[account(
        seeds = [asset_mint.key().as_ref()],
        bump,
    )]
    pub asset_controller: Box<Account<'info, AssetControllerAccount>>,
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
