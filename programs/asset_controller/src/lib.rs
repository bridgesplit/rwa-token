#![allow(ambiguous_glob_reexports, clippy::new_ret_no_self)]

pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

use anchor_lang::prelude::*;

declare_id!("acpcFrzEYKjVLvZGWueTV8vyDjhu3oKC7sN38QELLan");

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
    pub fn create_token_account(ctx: Context<CreateTokenAccount>) -> Result<()> {
        instructions::account::create::handler(ctx)
    }

    /// close a token account
    pub fn close_token_account(ctx: Context<CloseTokenAccount>) -> Result<()> {
        instructions::account::close::handler(ctx)
    }

    /// execute transfer hook
    #[interface(spl_transfer_hook_interface::execute)]
    pub fn execute_transaction(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
        instructions::execute::handler(ctx, amount)
    }
}
