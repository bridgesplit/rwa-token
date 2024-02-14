pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod asset_registry {
    use super::*;

    /// create an rwa asset
    pub fn create_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
        instructions::create::handler(ctx, args)
    }

    /// issue shares of the rwa asset
    pub fn issue_tokens(ctx: Context<IssueTokens>, amount: u64) -> Result<()> {
        instructions::issue::handler(ctx, amount)
    }

    // /// transfer shares of the rwa asset
    // pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
    //     instructions::transfer::handler(ctx, amount)
    // }

    /// void shares of the rwa asset
    pub fn void_tokens(ctx: Context<VoidTokens>, amount: u64) -> Result<()> {
        instructions::void::handler(ctx, amount)
    }

    // pub fn open_token_account(_ctx: Context<OpenTokenAccount>) -> Result<()> {
    //     Ok(())
    // }

    // pub fn close_token_account(ctx: Context<CloseTokenAccount>) -> Result<()> {
    //     instructions::close::handler(ctx)
    // }

    /// generate an approve account for a transaction
    pub fn approve_transaction(
        ctx: Context<GenerateTransactionApproval>,
        args: GenerateTransactionApprovalArgs,
    ) -> Result<()> {
        instructions::enforce::approve::handler(ctx, args)
    }

    /// execute transfer hook
    #[interface(spl_transfer_hook_interface::execute)]
    pub fn execute_transaction(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
        instructions::enforce::execute::handler(ctx, amount)
    }
}
