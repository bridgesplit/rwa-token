use crate::{state::*, PolicyEngineErrors};
use anchor_lang::prelude::*;

pub fn enforce_identity_filter(identity: &[u8], identity_filter: IdentityFilter) -> Result<()> {
    match identity_filter.comparision_type {
        ComparisionType::Or => {
            // if any level is in the identities array, return Ok
            for level in identity.iter() {
                if *level != 0 && identity_filter.identity_levels.contains(level) {
                    return Ok(());
                }
            }
            Err(PolicyEngineErrors::IdentityFilterFailed.into())
        }
        ComparisionType::And => {
            // if all levels are in the identities array, return Ok
            for level in identity_filter.identity_levels.iter() {
                if *level != 0 && !identity.contains(level) {
                    return Err(PolicyEngineErrors::IdentityFilterFailed.into());
                }
            }
            Ok(())
        }
    }
}

pub fn get_total_amount_transferred_in_timeframe(
    transfers: &Vec<Transfer>,
    timeframe: i64,
    timestamp: i64,
) -> u64 {
    let mut total_amount_transferred = 0;
    let min_timestamp = timestamp - timeframe;
    for transfer in transfers {
        if transfer.timestamp >= min_timestamp {
            total_amount_transferred += transfer.amount;
        }
    }
    total_amount_transferred
}

pub fn get_total_transactions_in_timeframe(
    transfers: &Vec<Transfer>,
    timeframe: i64,
    timestamp: i64,
) -> u64 {
    let mut total_transactions = 0;
    let min_timestamp = timestamp - timeframe;
    for transfer in transfers {
        if transfer.timestamp >= min_timestamp {
            total_transactions += 1;
        }
    }
    total_transactions
}

#[derive(InitSpace, AnchorDeserialize, AnchorSerialize, Copy, Clone)]
pub struct Transfer {
    pub amount: u64,
    pub timestamp: i64,
}

/// enforces different types of policies
#[inline(never)]
pub fn enforce_policy(
    policies: Vec<Policy>,
    amount: u64,
    timestamp: i64,
    identity: &[u8],
    balance: u64,
    transfers: &Vec<Transfer>,
) -> Result<()> {
    for policy in policies.iter() {
        match policy.policy_type {
            PolicyType::IdentityApproval => {
                enforce_identity_filter(identity, policy.identity_filter)?;
            }
            PolicyType::TransactionAmountLimit { limit } => {
                if enforce_identity_filter(identity, policy.identity_filter).is_ok()
                    && amount > limit
                {
                    return Err(PolicyEngineErrors::TransactionAmountLimitExceeded.into());
                }
            }
            PolicyType::TransactionAmountVelocity { limit, timeframe } => {
                if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
                    let total_amount_transferred =
                        get_total_amount_transferred_in_timeframe(transfers, timeframe, timestamp);

                    if total_amount_transferred + amount > limit {
                        return Err(PolicyEngineErrors::TransactionAmountVelocityExceeded.into());
                    }
                }
            }
            PolicyType::TransactionCountVelocity { limit, timeframe } => {
                if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
                    let total_transactions =
                        get_total_transactions_in_timeframe(transfers, timeframe, timestamp);
                    if total_transactions + 1 > limit {
                        return Err(PolicyEngineErrors::TransactionCountVelocityExceeded.into());
                    }
                }
            }
            PolicyType::MaxBalance { limit } => {
                if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
                    if amount + balance > limit {
                        return Err(PolicyEngineErrors::MaxBalanceExceeded.into());
                    }
                }
            }
        }
    }
    Ok(())
}
