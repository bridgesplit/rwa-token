pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

declare_id!("6FcM5R2KcdUGcdLunzLm3XLRFr7FiF6Hdz3EWni8YPa2");

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
    pub fn remove_policy(ctx: Context<RemovePolicy>) -> Result<()> {
        instructions::remove::handler(ctx)
    }
}
