use anchor_lang::prelude::*;

use crate::AssetControllerErrors;

#[account()]
pub struct TrackerAccount {
    pub version: u8,
    // corresponding asset mint
    pub asset_mint: Pubkey,
    // owner of the policy account
    pub owner: Pubkey,
    // last 10 transfer amounts - evict only if max_timeframe has passed
    pub transfer_amounts: [u64; 10],
    // last 10 transfer timestamps - evict only if max_timeframe has passed
    pub transfer_timestamps: [i64; 10],
}

impl TrackerAccount {
    pub const LEN: usize = 8 + std::mem::size_of::<TrackerAccount>();
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, asset_mint: Pubkey, owner: Pubkey) {
        self.version = Self::VERSION;
        self.asset_mint = asset_mint;
        self.owner = owner;
    }
    /// for all timestamps, if timestamp is older than timestamp - max_timeframe. remove it, set corresponding amount to 0 and sort the array
    /// then set final amount and timestamp to final non empty index or evict first entry and set final amount and timestamp to final index
    /// timestamps are stored in ascending order
    pub fn update_transfer_history(
        &mut self,
        amount: u64,
        timestamp: i64,
        max_timeframe: i64,
    ) -> Result<()> {
        let transfer_amounts = &mut self.transfer_amounts;
        let transfer_timestamps = &mut self.transfer_timestamps;
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
            // move 0s to end of array
            let mut i = 0;
            let mut j = 0;
            while i < transfer_amounts.len() {
                if transfer_amounts[i] != 0 {
                    transfer_amounts.swap(i, j);
                    transfer_timestamps.swap(i, j);
                    j += 1;
                }
                i += 1;
            }
            // add amount and timestamp to zero element
            for (i, t) in transfer_timestamps.iter().enumerate() {
                if *t == 0 {
                    transfer_amounts[i] = amount;
                    transfer_timestamps[i] = timestamp;
                    break;
                }
            }
            Ok(())
        } else {
            // add amount and timestamp to next element, if not found, return error
            for (i, t) in transfer_timestamps.iter().enumerate() {
                if *t == 0 {
                    transfer_amounts[i] = amount;
                    transfer_timestamps[i] = timestamp;
                    return Ok(());
                }
            }
            Err(AssetControllerErrors::TransferHistoryFull.into())
        }
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use crate::state::IdentityFilter;

//     #[test]
//     fn test_enforce_identity_filter() {
//         // identity contains 1 and 2
//         let identity = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0];
//         assert_eq!(
//             enforce_identity_filter(
//                 identity,
//                 IdentityFilter {
//                     comparision_type: ComparisionType::And.into(),
//                     identity_levels: vec![1, 2, 3],
//                 }
//             ),
//             Err(PolicyEngineErrors::IdentityFilterFailed.into())
//         );
//         // identity contains 1 or 2
//         let identity = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0];
//         assert_eq!(
//             enforce_identity_filter(
//                 identity,
//                 IdentityFilter {
//                     comparision_type: ComparisionType::Or.into(),
//                     identity_levels: vec![1, 2, 3],
//                 }
//             ),
//             Ok(())
//         );
//     }

//     #[test]
//     fn test_update_transfer_history() {
//         let mut transfer_amounts = [0; 10];
//         let mut transfer_timestamps = [0; 10];
//         let amount = 100;
//         let timestamp = 100;
//         let max_timeframe = 100;
//         update_transfer_history(
//             &mut transfer_amounts,
//             &mut transfer_timestamps,
//             amount,
//             timestamp,
//             max_timeframe,
//         )
//         .unwrap();
//         assert_eq!(transfer_amounts[0], amount);
//         assert_eq!(transfer_timestamps[0], timestamp);
//         let amount = 200;
//         let timestamp = 200;
//         update_transfer_history(
//             &mut transfer_amounts,
//             &mut transfer_timestamps,
//             amount,
//             timestamp,
//             max_timeframe,
//         )
//         .unwrap();
//         assert_eq!(transfer_amounts[1], amount);
//         assert_eq!(transfer_timestamps[1], timestamp);
//         let amount = 300;
//         let timestamp = 300;
//         update_transfer_history(
//             &mut transfer_amounts,
//             &mut transfer_timestamps,
//             amount,
//             timestamp,
//             max_timeframe,
//         )
//         .unwrap();
//         assert_eq!(transfer_amounts[1], amount);
//         assert_eq!(transfer_timestamps[1], timestamp);
//     }

//     #[test]
//     fn test_transfer_history_full() {
//         let mut transfer_amounts = [100; 10];
//         let mut transfer_timestamps = [100; 10];
//         let amount = 100;
//         let timestamp = 200;
//         let max_timeframe = 100;
//         assert_eq!(
//             update_transfer_history(
//                 &mut transfer_amounts,
//                 &mut transfer_timestamps,
//                 amount,
//                 timestamp,
//                 max_timeframe
//             ),
//             Err(PolicyEngineErrors::TransferHistoryFull.into())
//         );
//         // with smaller max_timeframe, it should work
//         let max_timeframe = 50;
//         assert_eq!(
//             update_transfer_history(
//                 &mut transfer_amounts,
//                 &mut transfer_timestamps,
//                 amount,
//                 timestamp,
//                 max_timeframe
//             ),
//             Ok(())
//         );
//         assert_eq!(transfer_amounts, [100, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
//         assert_eq!(transfer_timestamps, [200, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
//     }
// }
