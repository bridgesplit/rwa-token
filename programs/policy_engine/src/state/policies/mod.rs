use anchor_lang::{prelude::borsh, AnchorDeserialize, AnchorSerialize};
use num_enum::IntoPrimitive;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct IdentityFilter {
    pub identity_levels: Vec<u8>,
    pub comparision_type: u8,
}

impl IdentityFilter {
    pub const LEN: usize = 1 // u8 size
    * 10 // max 10 levels
    + 1; // comparision_type
}

#[repr(u8)]
#[derive(IntoPrimitive, AnchorDeserialize, AnchorSerialize, Clone)]
pub enum ComparisionType {
    And,
    Or,
}

pub mod identity_approval;
pub mod transaction_amount_limit;
pub mod transaction_amount_velocity;
pub mod transaction_count_velocity;

pub use identity_approval::*;
pub use transaction_amount_limit::*;
pub use transaction_amount_velocity::*;
pub use transaction_count_velocity::*;
