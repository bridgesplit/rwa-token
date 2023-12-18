use anchor_lang::prelude::*;

use crate::state::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateTransationApprovalArgs {
    pub amount: Option<u64>,
    pub instruction_name: String,
}

#[derive(Accounts)]
#[instruction(args: UpdateTransationApprovalArgs)]
pub struct UpdateTransactionApproval<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        constraint = authority.key() == asset_controller_data.transaction_approval_authority,
    )]
    pub authority: Signer<'info>,
    #[account()]
    pub owner: Signer<'info>,
    #[account(
        seeds = [asset_controller_data.asset_mint.key().as_ref(), ASSET_CONTROLLER_DATA_SEED.as_bytes()],
        bump,
    )]
    pub asset_controller_data: Box<Account<'info, AssetControllerData>>,
    #[account(
        mut,
        seeds = [asset_controller_data.asset_mint.key().as_ref(), ASSET_CONTROLLER_DATA_SEED.as_bytes()],
        bump,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(
    ctx: Context<UpdateTransactionApproval>,
    args: UpdateTransationApprovalArgs,
) -> Result<()> {
    let transaction_approval_account = &mut ctx.accounts.transaction_approval_account;
    transaction_approval_account.amount = args.amount;
    transaction_approval_account.instruction_name = args.instruction_name;
    transaction_approval_account.slot = ctx.accounts.clock.slot;

    Ok(())
}
