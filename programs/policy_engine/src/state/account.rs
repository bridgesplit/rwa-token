use anchor_lang::prelude::*;
use num_enum::IntoPrimitive;
use serde::{Deserialize, Serialize};

use crate::{
    enforce_identity_filter, get_total_amount_transferred_in_timeframe,
    get_total_transactions_in_timeframe, PolicyEngineErrors, Transfer,
};

#[derive(
    AnchorDeserialize, AnchorSerialize, Clone, InitSpace, Copy, Debug, Serialize, Deserialize,
)]
#[serde(rename_all = "camelCase")]
pub struct IdentityFilter {
    pub identity_levels: [u8; 10],         // 10
    pub comparision_type: ComparisionType, // 2
}

#[repr(u8)]
#[derive(
    IntoPrimitive,
    AnchorDeserialize,
    AnchorSerialize,
    Clone,
    InitSpace,
    Copy,
    Debug,
    Serialize,
    Deserialize,
)]
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

#[derive(
    AnchorSerialize,
    AnchorDeserialize,
    Clone,
    InitSpace,
    PartialEq,
    Copy,
    Debug,
    Serialize,
    Deserialize,
)]
pub enum PolicyType {
    IdentityApproval,
    TransactionAmountLimit { limit: u64 },
    TransactionAmountVelocity { limit: u64, timeframe: i64 },
    TransactionCountVelocity { limit: u64, timeframe: i64 },
    MaxBalance { limit: u64 },
    TransferPause,
    ForceFullTransfer,
    HolderLimit { limit: u64, current_number: u64 },
}

impl PolicyAccount {
    pub fn hash_policy(
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

    /// enforces different types of policies
    #[inline(never)]
    pub fn enforce_policy(
        &mut self,
        transfer_amount: u64,
        timestamp: i64,
        identity: &[u8],
        source_balance: u64,
        receiver_balance: u64,
        transfers: &Vec<Transfer>,
    ) -> Result<()> {
        for policy in self.policies.iter_mut() {
            match &mut policy.policy_type {
                PolicyType::IdentityApproval => {
                    enforce_identity_filter(identity, policy.identity_filter)?;
                }
                PolicyType::TransactionAmountLimit { limit } => {
                    if enforce_identity_filter(identity, policy.identity_filter).is_ok()
                        && transfer_amount > *limit
                    {
                        return Err(PolicyEngineErrors::TransactionAmountLimitExceeded.into());
                    }
                }
                PolicyType::TransactionAmountVelocity { limit, timeframe } => {
                    if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
                        let total_amount_transferred = get_total_amount_transferred_in_timeframe(
                            transfers, *timeframe, timestamp,
                        );

                        if total_amount_transferred + transfer_amount > *limit {
                            return Err(
                                PolicyEngineErrors::TransactionAmountVelocityExceeded.into()
                            );
                        }
                    }
                }
                PolicyType::TransactionCountVelocity { limit, timeframe } => {
                    if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
                        let total_transactions =
                            get_total_transactions_in_timeframe(transfers, *timeframe, timestamp);
                        if total_transactions + 1 > *limit {
                            return Err(PolicyEngineErrors::TransactionCountVelocityExceeded.into());
                        }
                    }
                }
                PolicyType::MaxBalance { limit } => {
                    if enforce_identity_filter(identity, policy.identity_filter).is_ok()
                        && transfer_amount + receiver_balance > *limit
                    {
                        return Err(PolicyEngineErrors::MaxBalanceExceeded.into());
                    }
                }
                PolicyType::TransferPause => {
                    return Err(PolicyEngineErrors::TransferPaused.into());
                }
                PolicyType::ForceFullTransfer => {
                    if enforce_identity_filter(identity, policy.identity_filter).is_ok()
                        && source_balance != transfer_amount
                    {
                        return Err(PolicyEngineErrors::ForceFullTransfer.into());
                    }
                }
                PolicyType::HolderLimit {
                    limit,
                    current_number,
                } => {
                    if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
                        if receiver_balance == 0 && source_balance != transfer_amount {
                            *current_number += 1;
                        }
                        if current_number > limit {
                            return Err(PolicyEngineErrors::HolderLimitExceeded.into());
                        }
                    }
                }
            }
        }
        Ok(())
    }
}
