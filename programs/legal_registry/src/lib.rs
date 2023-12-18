pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod legal_registry {
    use super::*;

    pub fn create_legal_registry(ctx: Context<CreateLegalRegistry>) -> Result<()> {
        instructions::create::handler(ctx)
    }

    pub fn delegate_legal_regsitry(ctx: Context<DelegateLegalRegistry>) -> Result<()> {
        instructions::delegate::handler(ctx)
    }

    pub fn close_legal_registry(_ctx: Context<CloseLegalRegistry>) -> Result<()> {
        Ok(())
    }

    pub fn create_legal_account(
        ctx: Context<CreateLegalAccount>,
        args: CreateLegalAccountArgs,
    ) -> Result<()> {
        instructions::account::create::handler(ctx, args)
    }

    pub fn update_legal_account(ctx: Context<RevokeLegalAccount>, uri: String) -> Result<()> {
        instructions::account::update::handler(ctx, uri)
    }

    pub fn close_legal_authorization(_ctx: Context<CloseLegalAccount>) -> Result<()> {
        Ok(())
    }
}
