use anchor_lang::prelude::*;

use crate::IdentityFilter;

#[account()]
pub struct TransactionAmountLimit {
    pub version: u8,
    pub policy_engine: Pubkey,
    pub limit: u64,
    pub identity_filter: IdentityFilter,
}

impl TransactionAmountLimit {
    pub const LEN: usize = 8 + 1 + 8 + IdentityFilter::LEN;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, policy_engine: Pubkey, limit: u64, identity_filter: IdentityFilter) {
        self.version = Self::VERSION;
        self.policy_engine = policy_engine;
        self.limit = limit;
        self.identity_filter = identity_filter;
    }
}
