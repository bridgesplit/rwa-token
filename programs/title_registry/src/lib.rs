pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod title_registry {
    use super::*;

    pub fn create_title_registry(ctx: Context<CreateTitleRegistry>) -> Result<()> {
        instructions::create::handler(ctx)
    }

    pub fn delegate_title_regsitry(ctx: Context<DelegateTitleRegistry>) -> Result<()> {
        instructions::delegate::handler(ctx)
    }

    pub fn close_title_registry(_ctx: Context<CloseTitleRegistry>) -> Result<()> {
        Ok(())
    }

    pub fn create_title_account(
        ctx: Context<CreateTitleAccount>,
        args: CreateTitleAccountArgs,
    ) -> Result<()> {
        instructions::account::create::handler(ctx, args)
    }

    pub fn revoke_title_account(ctx: Context<RevokeTitleAccount>) -> Result<()> {
        instructions::account::revoke::handler(ctx)
    }

    pub fn close_title_authorization(_ctx: Context<CloseTitleAccount>) -> Result<()> {
        Ok(())
    }
}
