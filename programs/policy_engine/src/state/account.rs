pub use anchor_lang::prelude::*;
use num_enum::IntoPrimitive;

#[derive(AnchorDeserialize, AnchorSerialize, Clone, InitSpace)]
pub struct IdentityFilter {
    pub identity_levels: [u8; 10],
    pub comparision_type: ComparisionType,
}

#[repr(u8)]
#[derive(IntoPrimitive, AnchorDeserialize, AnchorSerialize, Clone, InitSpace)]
pub enum ComparisionType {
    Or,
    And,
}

#[account()]
#[derive(InitSpace)]
pub struct PolicyAccount {
    pub version: u8,
    pub policy_engine: Pubkey,
    pub identity_filter: IdentityFilter,
    pub policy: Policy,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum Policy {
    IdentityApproval,
    TransactionAmountLimit { limit: u64 },
    TransactionAmountVelocity { limit: u64, timeframe: i64 },
    TransactionCountVelocity { limit: u64, timeframe: i64 },
}

impl PolicyAccount {
    pub fn new(&mut self, policy_engine: Pubkey, identity_filter: IdentityFilter, policy: Policy) {
        self.version = 1;
        self.policy_engine = policy_engine;
        self.identity_filter = identity_filter;
        self.policy = policy;
    }
}
