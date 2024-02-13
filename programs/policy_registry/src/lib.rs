pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod policy_registry {
    use super::*;

    /// create a policy registry
    pub fn create_policy_registry(ctx: Context<CreatePolicyRegistry>) -> Result<()> {
        instructions::registry::create::handler(ctx)
    }

    /// create a policy account
    pub fn create_policy_account(ctx: Context<CreatePolicyAccount>) -> Result<()> {
        instructions::account::create::handler(ctx)
    }

    /// attach policy functions

    /// attach a transaction count limit policy
    pub fn attach_always_require_approval(
        ctx: Context<AttachAlwaysRequireApproval>,
        identity_filter: IdentityFilter,
    ) -> Result<()> {
        instructions::registry::attach::always_require_approval::handler(ctx, identity_filter)
    }

    /// attach a transaction amount limit policy
    pub fn attach_transaction_amount_limit(
        ctx: Context<AttachTransactionAmountLimit>,
        limit: u64,
        identity_filter: IdentityFilter,
    ) -> Result<()> {
        instructions::registry::attach::transaction_amount_limit::handler(
            ctx,
            limit,
            identity_filter,
        )
    }

    /// attach a transaction amount velocity policy
    pub fn attach_transaction_amount_velocity(
        ctx: Context<AttachTransactionAmountVelocity>,
        limit: u64,
        timeframe: i64,
        identity_filter: IdentityFilter,
    ) -> Result<()> {
        instructions::registry::attach::transaction_amount_velocity::handler(
            ctx,
            limit,
            timeframe,
            identity_filter,
        )
    }

    /// attach a transaction count velocity policy
    pub fn attach_transaction_count_velocity(
        ctx: Context<AttachTransactionCountVelocity>,
        limit: u64,
        timeframe: i64,
        identity_filter: IdentityFilter,
    ) -> Result<()> {
        instructions::registry::attach::transaction_count_velocity::handler(
            ctx,
            limit,
            timeframe,
            identity_filter,
        )
    }

    /// remove policy account
    pub fn remove_policy_account(ctx: Context<RemovePolicyAccount>) -> Result<()> {
        instructions::registry::remove::handler(ctx)
    }
}
