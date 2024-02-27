use anchor_lang::prelude::*;

use crate::IdentityFilter;

#[account()]
pub struct IdentityApproval {
    pub version: u8,
    pub policy_engine: Pubkey,
    pub identity_filter: IdentityFilter,
}

impl IdentityApproval {
    pub const LEN: usize = 8 + 1 + IdentityFilter::LEN;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, policy_engine: Pubkey, identity_filter: IdentityFilter) {
        self.version = Self::VERSION;
        self.policy_engine = policy_engine;
        self.identity_filter = identity_filter;
    }
}
