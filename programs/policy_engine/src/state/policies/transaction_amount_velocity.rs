use anchor_lang::prelude::*;

#[account()]
pub struct TransactionAmountVelocity {
    pub current_amount: [u64; 10],
    pub last_updated: [i64; 10],
    pub limit: u64,
    pub period: i64,
    pub identity_levels: [u8; 16],
    pub comparision_type: u8,
}
