pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

declare_id!("DtrBDukceZpUnWmeNzqtoBQPdXW8p9xmWYG1z7qMt8qG");

#[program]
pub mod asset_controller {
    use super::*;

    /// create an rwa asset
    pub fn create_asset_controller(
        ctx: Context<CreateAssetController>,
        args: CreateAssetControllerArgs,
    ) -> Result<()> {
        instructions::create::handler(ctx, args)
    }

    /// issue shares of the rwa asset
    pub fn issue_tokens(ctx: Context<IssueTokens>, args: IssueTokensArgs) -> Result<()> {
        instructions::issue::handler(ctx, args)
    }

    /// void shares of the rwa asset
    pub fn void_tokens(ctx: Context<VoidTokens>, amount: u64) -> Result<()> {
        instructions::void::handler(ctx, amount)
    }

    /// create a token account
    pub fn create_token_account(_ctx: Context<CreateTokenAccount>) -> Result<()> {
        Ok(())
    }

    /// close a token account
    pub fn close_token_account(ctx: Context<CloseTokenAccount>) -> Result<()> {
        instructions::close::handler(ctx)
    }

    /// transfer tokens
    pub fn transfer_tokens<'info>(
        ctx: Context<'_, '_, '_, 'info, TransferTokens<'info>>,
        amount: u64,
        to: Pubkey,
    ) -> Result<()> {
        instructions::transfer::handler(ctx, amount, to)
    }

    /// generate an approve account for a transaction
    pub fn approve_transaction(
        ctx: Context<ApproveTransaction>,
        args: ApproveTransactionArgs,
    ) -> Result<()> {
        instructions::enforce::approve::handler(ctx, args)
    }

    /// execute transfer hook
    #[interface(spl_transfer_hook_interface::execute)]
    pub fn execute_transaction(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
        instructions::enforce::execute::handler(ctx, amount)
    }
}
