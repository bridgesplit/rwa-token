use anchor_lang::prelude::*;
use num_enum::IntoPrimitive;

use crate::PolicyEngineErrors;

#[derive(AnchorDeserialize, AnchorSerialize, Clone, InitSpace, Copy, Debug)]
pub struct IdentityFilter {
    pub identity_levels: [u8; 10],         // 10
    pub comparision_type: ComparisionType, // 2
}

#[repr(u8)]
#[derive(IntoPrimitive, AnchorDeserialize, AnchorSerialize, Clone, InitSpace, Copy, Debug)]
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
    #[max_len(1)]
    /// initial max len
    pub policies: Vec<Policy>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct Policy {
    #[max_len(64)]
    pub hash: String,
    pub identity_filter: IdentityFilter,
    pub policy_type: PolicyType,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Copy, Debug)]
pub enum PolicyType {
    IdentityApproval,
    TransactionAmountLimit { limit: u64 },
    TransactionAmountVelocity { limit: u64, timeframe: i64 },
    TransactionCountVelocity { limit: u64, timeframe: i64 },
}

impl PolicyAccount {
    fn hash_policy(
        policy_account: Pubkey,
        policy_type: PolicyType,
        identity_filter: IdentityFilter,
    ) -> String {
        let hash = format!("{:?}{:?}{:?}", policy_account, policy_type, identity_filter);
        sha256::digest(hash.as_bytes())
    }
    /// hash
    pub fn new(
        &mut self,
        policy_account: Pubkey,
        policy_engine: Pubkey,
        identity_filter: IdentityFilter,
        policy_type: PolicyType,
    ) {
        self.version = 1;
        self.policy_engine = policy_engine;
        self.policies = vec![Policy {
            hash: Self::hash_policy(policy_account, policy_type, identity_filter),
            policy_type,
            identity_filter,
        }];
    }
    pub fn attach(
        &mut self,
        policy_account: Pubkey,
        policy_type: PolicyType,
        identity_filter: IdentityFilter,
    ) -> Result<()> {
        let hash = Self::hash_policy(policy_account, policy_type, identity_filter);
        if self.policies.iter().any(|policy| policy.hash == hash) {
            return Err(PolicyEngineErrors::PolicyAlreadyExists.into());
        }
        self.policies.push(Policy {
            hash,
            policy_type,
            identity_filter,
        });
        Ok(())
    }

    pub fn detach(&mut self, hash: String) -> Result<PolicyType> {
        if self.policies.iter().all(|policy| policy.hash != hash) {
            return Err(PolicyEngineErrors::PolicyNotFound.into());
        }
        // remove and return the policy type
        let policy_type = self
            .policies
            .iter()
            .find(|policy| policy.hash == hash)
            .unwrap() // safe to unwrap as we checked the policy exists
            .policy_type;
        self.policies.retain(|policy| policy.hash != hash);
        Ok(policy_type)
    }
}
