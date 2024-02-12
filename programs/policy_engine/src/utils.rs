use anchor_lang::{error::Error, solana_program::hash, AccountDeserialize};

use crate::{state::*, PolicyEngineErrors};

pub fn get_policy_discriminator(policy_type: PolicyType) -> [u8; 8] {
    let discriminator_preimage = format!("account:{}", policy_type.to_string());
    let mut discriminator = [0u8; 8];
    discriminator.copy_from_slice(&hash::hash(discriminator_preimage.as_bytes()).to_bytes()[..8]);
    discriminator
}

/// Deserializes a policy and updates different types of policy accounts
pub fn deserialize_and_update_policy(
    data: &mut &[u8],
    amount: u64,
    blocktime: i64,
) -> Result<(), Error> {
    if data[..8] == get_policy_discriminator(PolicyType::AlwaysRequireApproval) {
        // no changes required
        Ok(())
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionAmountLimit) {
        let mut policy: TransactionAmountLimit =
            AccountDeserialize::try_deserialize(&mut &data[8..])?;
        policy.current_amount += amount;
        Ok(())
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionAmountVelocity) {
        
        Ok(())
    } else if data[..8] == get_policy_discriminator(PolicyType::TransactionCountVelocity) {
       
        Ok(())
    } else {
        return Err(PolicyEngineErrors::InvalidPolicy.into());
    }
}
