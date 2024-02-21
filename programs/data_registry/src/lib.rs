pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

use anchor_lang::prelude::*;

declare_id!("8WRaNVNMDqdwADbKYj7fBd47i2e5SFMSEs8TrA2Vd5io");

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
}
