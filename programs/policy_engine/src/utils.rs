use anchor_lang::{error::Error, solana_program::hash, AccountDeserialize};

use crate::{state::*, PolicyEngineErrors};

pub fn get_policy_discriminator(policy_type: PolicyType) -> [u8; 8] {
    let discriminator_preimage = format!("account:{}", policy_type.to_string());
    let mut discriminator = [0u8; 8];
    discriminator.copy_from_slice(&hash::hash(discriminator_preimage.as_bytes()).to_bytes()[..8]);
    discriminator
}

pub fn enforce_identity_filter(
    identity: [u8; 10],
    identity_filter: IdentityFilter,
) -> Result<(), Error> {
    match identity_filter.comparision_type {
        0 => {
            // TODO: use proper enum
            // if any level is in the identities array, return Ok
            for (_i, level) in identity.iter().enumerate() {
                if *level != 0 && identity_filter.identity_levels.contains(level) {
                    return Ok(());
                }
            }
            Err(PolicyEngineErrors::IdentityFilterFailed.into())
        }
        1 => {
            // if all levels are in the identities array, return Ok
            for level in identity_filter.identity_levels.iter() {
                if *level != 0 && !identity.contains(level) {
                    return Err(PolicyEngineErrors::IdentityFilterFailed.into());
                }
            }
            Ok(())
        }
        _ => Err(PolicyEngineErrors::IdentityFilterFailed.into()),
    }
}

pub fn get_total_amount_transferred_in_timeframe(
    transfer_amounts: [u64; 10],
    transfer_timestamps: [i64; 10],
    timeframe: i64,
    timestamp: i64,
) -> u64 {
    let mut total_amount_transferred = 0;
    let min_timestamp = timestamp - timeframe;
    for (i, t) in transfer_timestamps.iter().enumerate() {
        if *t > min_timestamp {
            total_amount_transferred += transfer_amounts[i];
        }
    }
    total_amount_transferred
}

pub fn get_total_transactions_in_timeframe(
    transfer_timestamps: [i64; 10],
    timeframe: i64,
    timestamp: i64,
) -> u64 {
    let mut total_transactions = 0;
    let min_timestamp = timestamp - timeframe;
    for t in transfer_timestamps.iter() {
        if *t > min_timestamp {
            total_transactions += 1;
        }
    }
    total_transactions
}

/// Deserializes a policy and enforces different types of policy accounts
pub fn deserialize_and_enforce_policy(
    data: &[u8],
    amount: u64,
    timestamp: i64,
    identity: [u8; 10],
    transfer_amounts: [u64; 10],
    transfer_timestamps: [i64; 10],
) -> Result<(), Error> {
    if data[..8] == get_policy_discriminator(PolicyType::IdentityApproval) {
        let policy: IdentityApproval = AccountDeserialize::try_deserialize(&mut &data[..])?;
        enforce_identity_filter(identity, policy.identity_filter)?;
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionAmountLimit) {
        let policy: TransactionAmountLimit = AccountDeserialize::try_deserialize(&mut &data[..])?;
        if enforce_identity_filter(identity, policy.identity_filter).is_ok()
            && amount > policy.limit
        {
            return Err(PolicyEngineErrors::TransactionAmountLimitExceeded.into());
        }
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionAmountVelocity) {
        let policy: TransactionAmountVelocity =
            AccountDeserialize::try_deserialize(&mut &data[..])?;
        if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
            let total_amount_transferred = get_total_amount_transferred_in_timeframe(
                transfer_amounts,
                transfer_timestamps,
                policy.timeframe,
                timestamp,
            );

            if total_amount_transferred + amount > policy.limit {
                return Err(PolicyEngineErrors::TransactionAmountVelocityExceeded.into());
            }
        }
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionCountVelocity) {
        let policy: TransactionCountVelocity = AccountDeserialize::try_deserialize(&mut &data[..])?;
        if enforce_identity_filter(identity, policy.identity_filter).is_ok() {
            let total_transactions = get_total_transactions_in_timeframe(
                transfer_timestamps,
                policy.timeframe,
                timestamp,
            );
            if total_transactions + 1 > policy.limit {
                return Err(PolicyEngineErrors::TransactionCountVelocityExceeded.into());
            }
        }
    } else {
        return Err(PolicyEngineErrors::InvalidPolicy.into());
    }
    Ok(())
}
