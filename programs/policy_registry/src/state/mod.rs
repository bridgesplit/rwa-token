pub const TOKEN22: Pubkey = anchor_spl::token_2022::ID;

use anchor_lang::{prelude::*, AnchorSerialize};

pub mod policies;

pub use policies::*;

use crate::PolicyRegistryErrors;

#[account()]
pub struct PolicyRegistry {
    /// asset mint
    pub asset_mint: Pubkey,
    /// authority of the registry
    pub authority: Pubkey,
    /// policy delegate
    pub delegate: Pubkey,
    /// max timeframe of all the policies
    pub max_timeframe: i64,
    /// list of all policies
    pub policies: [Pubkey; 10],
}

impl PolicyRegistry {
    pub const LEN: usize = 8 + std::mem::size_of::<PolicyRegistry>();
    pub fn new(&mut self, authority: Pubkey, delegate: Pubkey, asset_mint: Pubkey) {
        self.authority = authority;
        self.delegate = delegate;
        self.asset_mint = asset_mint;
    }
    /// add policy if there is space
    pub fn add_policy(&mut self, policy: Pubkey) -> Result<()> {
        for i in 0..self.policies.len() {
            if self.policies[i] == Pubkey::default() {
                self.policies[i] = policy;
                return Ok(());
            }
        }
        Err(PolicyRegistryErrors::PolicyRegistryFull.into())
    }
    /// update max timeframe if new value is greater than current
    pub fn update_max_timeframe(&mut self, max_timeframe: i64) {
        if max_timeframe > self.max_timeframe {
            self.max_timeframe = max_timeframe;
        }
    }
    /// remove policy if found, rearrange array to push all non-default keys to the end
    pub fn remove_policy(&mut self, policy: Pubkey) -> Result<()> {
        let mut found = false;
        for i in 0..self.policies.len() {
            if self.policies[i] == policy {
                self.policies[i] = Pubkey::default();
                found = true;
            }
        }
        if found {
            let mut j = 0;
            for i in 0..self.policies.len() {
                if self.policies[i] != Pubkey::default() {
                    self.policies.swap(i, j);
                    j += 1;
                }
            }
            Ok(())
        } else {
            Err(PolicyRegistryErrors::PolicyNotFound.into())
        }
    }
}

pub enum PolicyType {
    IdentityApproval,
    TransactionCountVelocity,
    TransactionAmountVelocity,
    TransactionAmountLimit,
}

impl ToString for PolicyType {
    fn to_string(&self) -> String {
        match self {
            PolicyType::IdentityApproval => "IdentityApproval".to_string(),
            PolicyType::TransactionCountVelocity => "TransactionCountVelocity".to_string(),
            PolicyType::TransactionAmountVelocity => "TransactionAmountVelocity".to_string(),
            PolicyType::TransactionAmountLimit => "TransactionAmountLimit".to_string(),
        }
    }
}
