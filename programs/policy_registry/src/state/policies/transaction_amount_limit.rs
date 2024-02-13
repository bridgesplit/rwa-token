use anchor_lang::prelude::*;

use crate::IdentityFilter;

#[account()]
pub struct TransactionAmountLimit {
    pub version: u8,
    pub limit: u64,
    pub identity_filter: IdentityFilter,
}

impl TransactionAmountLimit {
    pub const LEN: usize = 8 + 8 + 8 + 16 + 1;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, limit: u64, identity_filter: IdentityFilter) {
        self.limit = limit;
        self.identity_filter = identity_filter;
    }
}
