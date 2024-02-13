use anchor_lang::{prelude::borsh, AnchorDeserialize, AnchorSerialize};
use num_enum::IntoPrimitive;

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct IdentityFilter {
    pub identity_levels: [u8; 16],
    pub comparision_type: ComparisionType,
}

#[repr(u8)]
#[derive(IntoPrimitive, AnchorDeserialize, AnchorSerialize, Clone)]
pub enum ComparisionType {
    And,
    Or,
}

pub mod always_require_approval;
pub mod transaction_amount_limit;
pub mod transaction_amount_velocity;
pub mod transaction_count_velocity;

pub use always_require_approval::*;
pub use transaction_amount_limit::*;
pub use transaction_amount_velocity::*;
pub use transaction_count_velocity::*;
