pub const TOKEN22: Pubkey = anchor_spl::token_2022::ID;

use anchor_lang::{prelude::*, AnchorSerialize};

pub mod policies;

pub use policies::*;

use crate::PolicyRegistryErrors;

#[account()]
pub struct PolicyRegistry {
    pub asset_mint: Pubkey,
    pub authority: Pubkey,
    pub max_timeframe: i64,
    pub policies: [Pubkey; 10],
}

impl PolicyRegistry {
    pub const LEN: usize = 32 + 80 + 80;
    pub fn new(&mut self, asset_mint: Pubkey) {
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
    AlwaysRequireApproval,
    TransactionCountVelocity,
    TransactionAmountVelocity,
    TransactionAmountLimit,
}

impl ToString for PolicyType {
    fn to_string(&self) -> String {
        match self {
            PolicyType::AlwaysRequireApproval => "AlwaysRequireApproval".to_string(),
            PolicyType::TransactionCountVelocity => "TransactionCountVelocity".to_string(),
            PolicyType::TransactionAmountVelocity => "TransactionAmountVelocity".to_string(),
            PolicyType::TransactionAmountLimit => "TransactionAmountLimit".to_string(),
        }
    }
}

#[account()]
pub struct PolicyAccount {
    pub version: u8,
    pub policy_registry: Pubkey,
    pub owner: Pubkey,
    pub transfer_amounts: [u64; 10],
    pub transfer_timestamps: [i64; 10],
}

impl PolicyAccount {
    pub const LEN: usize = 32 + 8 + 8 + 80;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, policy_registry: Pubkey, owner: Pubkey) {
        self.version = Self::VERSION;
        self.policy_registry = policy_registry;
        self.owner = owner;
    }
}
