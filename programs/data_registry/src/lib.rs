#![allow(ambiguous_glob_reexports, clippy::new_ret_no_self)]

pub mod error;
pub mod instructions;
pub mod state;

pub use error::*;
pub use instructions::*;
pub use state::*;

use anchor_lang::prelude::*;

declare_id!("dataeP5X1e7XsWN1ovDSEDP5cqaEUnKBmHE5iZhXPVw");

#[program]
pub mod data_registry {
    use super::*;

    /// registry functions
    /// create data registry
    pub fn create_data_registry(
        ctx: Context<CreateDataRegistry>,
        authority: Pubkey,
        delegate: Option<Pubkey>,
    ) -> Result<()> {
        instructions::registry::create::handler(ctx, authority, delegate)
    }

    /// delegate data registry
    pub fn delegate_data_regsitry(
        ctx: Context<DelegateDataRegistry>,
        delegate: Pubkey,
    ) -> Result<()> {
        instructions::registry::delegate::handler(ctx, delegate)
    }

    /// data functions
    /// create data account
    pub fn create_data_account(
        ctx: Context<CreateDataAccount>,
        args: CreateDataAccountArgs,
    ) -> Result<()> {
        instructions::account::create::handler(ctx, args)
    }

    /// update data account
    pub fn update_data_account(
        ctx: Context<UpdateDataAccount>,
        args: UpdateDataAccountArgs,
    ) -> Result<()> {
        instructions::account::update::handler(ctx, args)
    }

    /// delete data account
    pub fn delete_data_account(_ctx: Context<DeleteDataAccount>) -> Result<()> {
        Ok(())
    }
}
