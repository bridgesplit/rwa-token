use anchor_lang::prelude::*;

use crate::IdentityFilter;

#[account()]
pub struct AlwaysRequireApproval {
    pub version: u8,
    pub identity_filter: IdentityFilter,
}

impl AlwaysRequireApproval {
    pub const LEN: usize = 8 + 16 + 1;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, identity_filter: IdentityFilter) {
        self.version = Self::VERSION;
        self.identity_filter = identity_filter;
    }
}
