pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

use anchor_lang::prelude::*;

declare_id!("qDnvwpjBYjH1vs1N1CSdbVkEkePp2acL7TphAYZDeoV");

#[program]
pub mod identity_registry {
    use super::*;

    /// registry functions
    /// create identity registry
    pub fn create_identity_registry(
        ctx: Context<CreateIdentityRegistry>,
        authority: Pubkey,
        delegate: Pubkey,
    ) -> Result<()> {
        instructions::registry::create::handler(ctx, authority, delegate)
    }

    /// delegate identity registry
    pub fn delegate_identity_regsitry(
        ctx: Context<DelegateIdentityRegistry>,
        delegate: Pubkey,
    ) -> Result<()> {
        instructions::registry::delegate::handler(ctx, delegate)
    }

    /// identity functions
    /// create identity account
    pub fn create_identity_account(
        ctx: Context<CreateIdentityAccount>,
        owner: Pubkey,
        level: u8,
    ) -> Result<()> {
        instructions::account::create::handler(ctx, owner, level)
    }

    /// add level to identity account
    pub fn add_level_identity_account(
        ctx: Context<AddLevelIdentityAccount>,
        owner: Pubkey,
        level: u8,
    ) -> Result<()> {
        instructions::account::add::handler(ctx, owner, level)
    }

    /// remove level from identity account
    pub fn remove_level_identity_account(
        ctx: Context<RemoveLevelIdentityAccount>,
        owner: Pubkey,
        level: u8,
    ) -> Result<()> {
        instructions::account::remove::handler(ctx, owner, level)
    }

    /// revoke level from identity account
    pub fn revoke_identity_account(
        ctx: Context<RevokeIdentityAccount>,
        owner: Pubkey,
    ) -> Result<()> {
        instructions::account::revoke::handler(ctx, owner)
    }
}
