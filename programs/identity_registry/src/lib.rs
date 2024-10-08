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

declare_id!("idtynCMYbdisCTv4FrCWPSQboZb1uM4TV2cPi79yxQf");

#[program]
pub mod identity_registry {
    use super::*;

    /// registry functions
    /// create identity registry
    pub fn create_identity_registry(
        ctx: Context<CreateIdentityRegistry>,
        authority: Pubkey,
        delegate: Option<Pubkey>,
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
    pub fn add_level_to_identity_account(
        ctx: Context<AddLevelToIdentityAccount>,
        level: u8,
    ) -> Result<()> {
        instructions::account::add::handler(ctx, level)
    }

    /// remove level from identity account
    pub fn remove_level_from_identity_account(
        ctx: Context<RemoveLevelFromIdentityAccount>,
        level: u8,
    ) -> Result<()> {
        instructions::account::remove::handler(ctx, level)
    }

    /// revoke user identity account by closing account
    pub fn revoke_identity_account(
        _ctx: Context<RevokeIdentityAccount>,
        _owner: Pubkey,
    ) -> Result<()> {
        // no extra steps needed, identity account is being properly closed
        Ok(())
    }

    /// edit identity metadata
    pub fn edit_identity_metdata(
        ctx: Context<EditIdentityMetadata>,
        level: u8,
        max_allowed: Option<u64>,
    ) -> Result<()> {
        instructions::metadata::handler(ctx, level, max_allowed)
    }
}
