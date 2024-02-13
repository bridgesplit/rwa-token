use anchor_lang::{error::Error, solana_program::hash, AccountDeserialize};

use crate::{state::*, PolicyRegistryErrors};

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
        ComparisionType::Or => {
            // if any level is in the identities array, return Ok
            for (_i, level) in identity.iter().enumerate() {
                if *level != 0 && identity_filter.identity_levels.contains(level) {
                    return Ok(());
                }
            }
            return Err(PolicyRegistryErrors::IdentityFilterFailed.into());
        }
        ComparisionType::And => {
            // if all levels are in the identities array, return Ok
            for level in identity_filter.identity_levels.iter() {
                if *level != 0 && !identity.contains(level) {
                    return Err(PolicyRegistryErrors::IdentityFilterFailed.into());
                }
            }
            return Ok(());
        }
    }
}

pub fn get_total_amount_transferred_in_timeframe(
    transfer_amounts: &[u64; 10],
    transfer_timestamps: &[i64; 10],
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
    transfer_timestamps: &[i64; 10],
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

/// for all timestamps, if timestamp is older than timestamp - max_timeframe. remove it, set corresponding amount to 0 and sort the array
/// then set final amount and timestamp to final non empty index or evict first entry and set final amount and timestamp to final index
/// timestamps are stored in ascending order
pub fn update_transfer_history_if_required(
    transfer_amounts: &mut [u64; 10],
    transfer_timestamps: &mut [i64; 10],
    amount: u64,
    timestamp: i64,
    max_timeframe: i64,
) {
    let min_timestamp = timestamp - max_timeframe;
    let mut evicted = false;
    for (i, t) in transfer_timestamps.iter_mut().enumerate() {
        if *t < min_timestamp {
            evicted = true;
            transfer_amounts[i] = 0;
            *t = 0_i64;
        }
    }
    if evicted {
        transfer_timestamps.sort();
        // move 0s to end of array since amounts cannot be sorted
        let mut i = 0;
        let mut j = 0;
        while i < transfer_amounts.len() {
            if transfer_amounts[i] != 0 {
                transfer_amounts.swap(i, j);
                j += 1;
            }
            i += 1;
        }
        // add amount and timestamp to zero element
        for (i, t) in transfer_timestamps.iter().enumerate() {
            if *t == 0 {
                transfer_amounts[i] = amount;
                transfer_timestamps[i] = timestamp;
                return;
            }
        }
    } else {
        // move all elements to the left and add amount and timestamp to the end
        for i in 0..transfer_timestamps.len() - 1 {
            transfer_amounts[i] = transfer_amounts[i + 1];
            transfer_timestamps[i] = transfer_timestamps[i + 1];
        }
        transfer_amounts[transfer_amounts.len() - 1] = amount;
        transfer_timestamps[transfer_timestamps.len() - 1] = timestamp;
    }
}

/// Deserializes a policy and enforces different types of policy accounts
pub fn deserialize_and_enforce_policy(
    data: &[u8],
    amount: u64,
    timestamp: i64,
    identity: [u8; 10],
    max_timeframe: i64,
    transfer_amounts: &mut [u64; 10],
    transfer_timestamps: &mut [i64; 10],
) -> Result<(), Error> {
    if data[..8] == get_policy_discriminator(PolicyType::AlwaysRequireApproval) {
        let policy: AlwaysRequireApproval = AccountDeserialize::try_deserialize(&mut &data[8..])?;
        enforce_identity_filter(identity, policy.identity_filter)?;
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionAmountLimit) {
        let policy: TransactionAmountLimit = AccountDeserialize::try_deserialize(&mut &data[8..])?;
        enforce_identity_filter(identity, policy.identity_filter)?;
        if amount > policy.limit {
            return Err(PolicyRegistryErrors::TransactionAmountLimitExceeded.into());
        }
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionAmountVelocity) {
        let policy: TransactionAmountVelocity =
            AccountDeserialize::try_deserialize(&mut &data[8..])?;

        let total_amount_transferred = get_total_amount_transferred_in_timeframe(
            transfer_amounts,
            transfer_timestamps,
            policy.timeframe,
            timestamp,
        );

        if total_amount_transferred + amount > policy.limit {
            return Err(PolicyRegistryErrors::TransactionAmountVelocityExceeded.into());
        }
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionCountVelocity) {
        let policy: TransactionCountVelocity =
            AccountDeserialize::try_deserialize(&mut &data[8..])?;
        let total_transactions =
            get_total_transactions_in_timeframe(transfer_timestamps, policy.timeframe, timestamp);
        if total_transactions + 1 > policy.limit {
            return Err(PolicyRegistryErrors::TransactionCountVelocityExceeded.into());
        }
    } else {
        return Err(PolicyRegistryErrors::InvalidPolicy.into());
    }
    update_transfer_history_if_required(
        transfer_amounts,
        transfer_timestamps,
        amount,
        timestamp,
        max_timeframe,
    );
    Ok(())
}
