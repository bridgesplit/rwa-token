pub use anchor_lang::prelude::*;
use num_enum::IntoPrimitive;

#[derive(AnchorDeserialize, AnchorSerialize, Clone, InitSpace, Copy)]
pub struct IdentityFilter {
    pub identity_levels: [u8; 10],
    pub comparision_type: ComparisionType,
}

#[repr(u8)]
#[derive(IntoPrimitive, AnchorDeserialize, AnchorSerialize, Clone, InitSpace, Copy)]
pub enum ComparisionType {
    Or,
    And,
}

#[account()]
#[derive(InitSpace)]
pub struct PolicyAccount {
    pub version: u8,
    /// Engine account that the policy belongs to
    pub policy_engine: Pubkey,
    /// Different policies that can be applied to the policy account
    #[max_len(1)] // initial max_len
    pub policies: Vec<Policy>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct Policy {
    pub policy_type: PolicyType,
    pub identity_filter: IdentityFilter,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Copy)]
pub enum PolicyType {
    IdentityApproval,
    TransactionAmountLimit { limit: u64 },
    TransactionAmountVelocity { limit: u64, timeframe: i64 },
    TransactionCountVelocity { limit: u64, timeframe: i64 },
}

impl PolicyAccount {
    pub fn new(
        &mut self,
        policy_engine: Pubkey,
        identity_filter: IdentityFilter,
        policy_type: PolicyType,
    ) {
        self.version = 1;
        self.policy_engine = policy_engine;
        self.policies = vec![Policy {
            policy_type,
            identity_filter,
        }];
    }
    pub fn attach(&mut self, policy_type: PolicyType, identity_filter: IdentityFilter) {
        self.policies.push(Policy {
            policy_type,
            identity_filter,
        });
    }

    pub fn detach(&mut self, policy_type: PolicyType) {
        self.policies
            .retain(|policy| policy.policy_type != policy_type);
    }
}
