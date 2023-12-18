pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod asset_controller {
    use super::*;

    pub fn create_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
        instructions::create::handler(ctx, args)
    }

    pub fn issue_tokens(ctx: Context<IssueTokens>, amount: u64) -> Result<()> {
        instructions::issue::handler(ctx, amount)
    }

    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        instructions::transfer::handler(ctx, amount)
    }

    pub fn void_tokens(ctx: Context<VoidTokens>, amount: u64) -> Result<()> {
        instructions::void::handler(ctx, amount)
    }

    pub fn open_token_account(_ctx: Context<OpenTokenAccount>) -> Result<()> {
        Ok(())
    }

    pub fn close_token_account(ctx: Context<CloseTokenAccount>) -> Result<()> {
        instructions::close::handler(ctx)
    }

    pub fn generate_transaction_approval(
        ctx: Context<GenerateTransactionApproval>,
        args: GenerateTransationApprovalArgs,
    ) -> Result<()> {
        instructions::approval::generate::handler(ctx, args)
    }

    pub fn update_transaction_approver(
        ctx: Context<UpdateTransactionApproval>,
        args: UpdateTransationApprovalArgs,
    ) -> Result<()> {
        instructions::approval::update::handler(ctx, args)
    }
}
