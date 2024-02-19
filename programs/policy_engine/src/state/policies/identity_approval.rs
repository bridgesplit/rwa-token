use anchor_lang::prelude::*;

use crate::IdentityFilter;

#[account()]
pub struct IdentityApproval {
    pub version: u8,
    pub identity_filter: IdentityFilter,
}

impl IdentityApproval {
    pub const LEN: usize = 8 + 1 + IdentityFilter::LEN;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, identity_filter: IdentityFilter) {
        self.version = Self::VERSION;
        self.identity_filter = identity_filter;
    }
}
