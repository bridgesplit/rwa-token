pub mod error;
pub mod instructions;
pub mod state;

pub use error::*;
pub use instructions::*;
pub use state::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod asset_data_registry {
    use super::*;

    /// registry functions
    /// create data registry
    pub fn create_data_registry(
        ctx: Context<CreateDataRegistry>,
        args: CreateDataRegistryArgs,
    ) -> Result<()> {
        instructions::registry::create::handler(ctx, args)
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
