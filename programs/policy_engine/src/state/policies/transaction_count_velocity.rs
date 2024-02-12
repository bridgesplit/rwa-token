use anchor_lang::prelude::*;

#[account()]
pub struct TransactionCountVelocity {
    pub current_count: u64,
    pub last_updated: i64,
    pub limit: u64,
    pub period: i64,
    pub identity_levels: [u8; 16],
    pub comparision_type: u8,
}
