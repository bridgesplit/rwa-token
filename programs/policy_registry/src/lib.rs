pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

use anchor_lang::prelude::*;

declare_id!("6FcM5R2KcdUGcdLunzLm3XLRFr7FiF6Hdz3EWni8YPa2");

#[program]
pub mod policy_registry {
    use super::*;

    /// create a policy registry
    pub fn create_policy_registry(
        ctx: Context<CreatePolicyRegistry>,
        authority: Pubkey,
        delegate: Pubkey,
    ) -> Result<()> {
        instructions::registry::create::handler(ctx, authority, delegate)
    }

    /// attach policies
    /// attach a transaction count limit policy
    pub fn attach_identity_approval(
        ctx: Context<AttachIdentityApproval>,
        identity_filter: IdentityFilter,
    ) -> Result<()> {
        instructions::registry::attach::identity_approval::handler(ctx, identity_filter)
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

    /// remove policy
    pub fn remove_policy(ctx: Context<RemovePolicy>) -> Result<()> {
        instructions::registry::remove::handler(ctx)
    }
}
