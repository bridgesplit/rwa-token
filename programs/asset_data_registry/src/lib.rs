pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod asset_data_registry {
    use super::*;

    pub fn create_data_registry(ctx: Context<CreateDataRegistry>) -> Result<()> {
        instructions::create::handler(ctx)
    }

    pub fn delegate_data_regsitry(ctx: Context<DelegateDataRegistry>) -> Result<()> {
        instructions::delegate::handler(ctx)
    }

    pub fn close_data_registry(_ctx: Context<CloseDataRegistry>) -> Result<()> {
        Ok(())
    }

    pub fn create_data_account(
        ctx: Context<CreateDataAccount>,
        args: CreateDataAccountArgs,
    ) -> Result<()> {
        instructions::account::create::handler(ctx, args)
    }

    pub fn update_data_account(ctx: Context<RevokeDataAccount>, data: [u8; 1024]) -> Result<()> {
        instructions::account::update::handler(ctx, data)
    }

    pub fn close_data_authorization(_ctx: Context<CloseDataAccount>) -> Result<()> {
        Ok(())
    }
}
