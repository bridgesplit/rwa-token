pub mod instructions;
pub mod state;
pub mod utils;

pub use instructions::*;
pub use state::*;
pub use utils::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod identity_registry {
    use super::*;

    pub fn create_identity_registry(ctx: Context<CreateIdentityRegistry>) -> Result<()> {
        instructions::create::handler(ctx)
    }

    pub fn delegate_identity_regsitry(ctx: Context<DelegateIdentityRegistry>) -> Result<()> {
        instructions::delegate::handler(ctx)
    }

    pub fn close_identity_registry(_ctx: Context<CloseIdentityRegistry>) -> Result<()> {
        Ok(())
    }

    pub fn approve_identity_account(_ctx: Context<ApproveIdentityAccount>) -> Result<()> {
        Ok(())
    }

    pub fn revoke_identity_account(_ctx: Context<RevokeIdentityAccount>) -> Result<()> {
        Ok(())
    }

    pub fn check_identity_authorization(
        ctx: Context<CheckIdentityAuthorization>,
        args: ::asset_controller::GenerateTransationApprovalArgs,
    ) -> Result<()> {
        instructions::check_authorization::handler(ctx, args)
    }
}
