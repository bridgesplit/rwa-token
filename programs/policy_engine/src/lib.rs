#![allow(ambiguous_glob_reexports, clippy::new_ret_no_self)]

pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

declare_id!("po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau");

#[program]
pub mod policy_engine {
    use super::*;

    /// create a policy registry
    pub fn create_policy_engine(
        ctx: Context<CreatePolicyEngine>,
        authority: Pubkey,
        delegate: Option<Pubkey>,
    ) -> Result<()> {
        instructions::engine::create::handler(ctx, authority, delegate)
    }

    /// attach policies
    /// attach a transaction count limit policy
    pub fn attach_policy_account(
        ctx: Context<AttachIdentityApproval>,
        identity_filter: IdentityFilter,
        policy: Policy,
    ) -> Result<()> {
        instructions::attach::handler(ctx, identity_filter, policy)
    }

    /// remove policy
    pub fn remove_policy(_ctx: Context<RemovePolicy>) -> Result<()> {
        // policy account is closed, no further action required
        Ok(())
    }
}
