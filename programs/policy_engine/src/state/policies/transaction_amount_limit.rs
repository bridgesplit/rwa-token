use anchor_lang::prelude::*;

#[account()]
pub struct TransactionAmountLimit {
    pub current_amount: u64,
    pub limit: u64,
    pub identity_levels: Vec<u8>,
    pub comparision_type: u8,
}
