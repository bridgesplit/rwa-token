use anchor_lang::prelude::*;

use crate::IdentityFilter;

#[account()]
pub struct TransactionAmountVelocity {
    pub version: u8,
    pub limit: u64,
    pub timeframe: i64,
    pub identity_filter: IdentityFilter,
}

impl TransactionAmountVelocity {
    pub const LEN: usize = 8 + 1 + 8 + 8 + IdentityFilter::LEN;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, limit: u64, timeframe: i64, identity_filter: IdentityFilter) {
        self.version = Self::VERSION;
        self.limit = limit;
        self.timeframe = timeframe;
        self.identity_filter = identity_filter;
    }
}
