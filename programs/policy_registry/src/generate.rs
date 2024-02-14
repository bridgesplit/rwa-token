use anchor_lang::prelude::*;

use crate::state::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GenerateTransationApprovalArgs {
    pub nonce: Pubkey,
    pub amount: Option<u64>,
    pub instruction_name: String,
}

#[derive(Accounts)]
#[instruction(args: GenerateTransationApprovalArgs)]
pub struct GenerateTransactionApproval<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        constraint = authority.key() == asset_registry.transaction_approval_authority,
    )]
    pub authority: Signer<'info>,
    #[account()]
    pub owner: Signer<'info>,
    #[account(
        seeds = [asset_registry.asset_mint.key().as_ref(), ASSET_CONTROLLER_DATA_SEED.as_bytes()],
        bump,
    )]
    pub asset_registry: Box<Account<'info, AssetRegistry>>,
    #[account(
        init,
        space = TransactionApprovalAccount::LEN,
        seeds = [asset_registry.asset_mint.key().as_ref(), ASSET_CONTROLLER_DATA_SEED.as_bytes()],
        bump,
        payer = payer,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(
    ctx: Context<GenerateTransactionApproval>,
    args: GenerateTransationApprovalArgs,
) -> Result<()> {
    let transaction_approval_account = &mut ctx.accounts.transaction_approval_account;
    transaction_approval_account.nonce = args.nonce;
    transaction_approval_account.owner = ctx.accounts.owner.key();
    transaction_approval_account.approval_authority = ctx.accounts.authority.key();
    transaction_approval_account.asset_mint = ctx.accounts.asset_registry.asset_mint;
    transaction_approval_account.amount = args.amount;
    transaction_approval_account.instruction_name = args.instruction_name;
    transaction_approval_account.slot = ctx.accounts.clock.slot;

    Ok(())
}
