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

declare_id!("po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau");

#[program]
#[allow(deprecated)]
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

    /// policies
    /// create policy account
    pub fn create_policy_account(
        ctx: Context<CreatePolicyAccount>,
        identity_filter: IdentityFilter,
        policy_type: PolicyType,
    ) -> Result<()> {
        instructions::account::create::handler(ctx, identity_filter, policy_type)
    }

    /// attach a policy
    pub fn attach_to_policy_account(
        ctx: Context<AttachToPolicyAccount>,
        identity_filter: IdentityFilter,
        policy_type: PolicyType,
    ) -> Result<()> {
        instructions::account::attach::handler(ctx, identity_filter, policy_type)
    }

    /// remove policy
    pub fn detach_from_policy_account(
        ctx: Context<DetachFromPolicyAccount>,
        hash: String,
    ) -> Result<()> {
        instructions::account::detach::handler(ctx, hash)
    }

    /// create tracker account
    pub fn create_tracker_account(ctx: Context<CreateTrackerAccount>) -> Result<()> {
        instructions::tracker::handler(ctx)
    }

    /// execute transfer hook
    #[interface(spl_transfer_hook_interface::execute)]
    pub fn execute_transaction(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
        instructions::execute::handler(ctx, amount)
    }
}
