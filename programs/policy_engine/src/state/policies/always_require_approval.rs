use anchor_lang::prelude::*;

#[account()]
pub struct AlwaysRequireApproval {
    pub identity_levels: [u8; 16],
    pub comparision_type: u8,
}
