use anchor_lang::{prelude::*, AnchorSerialize};

pub mod policies;

pub use policies::*;

#[account()]
pub struct PolicyAccount {
    pub policies: [Pubkey; 10],
}

pub enum ComparisionType {
    And,
    Or,
    EqualToOrAbove,
    EqualToOrBelow,
}

pub enum PolicyType {
    AlwaysRequireApproval,
    TransactionCountVelocity,
    TransactionAmountVelocity,
    TransactionAmountLimit,
}

impl ToString for PolicyType {
    fn to_string(&self) -> String {
        match self {
            PolicyType::AlwaysRequireApproval => "AlwaysRequireApproval".to_string(),
            PolicyType::TransactionCountVelocity => "TransactionCountVelocity".to_string(),
            PolicyType::TransactionAmountVelocity => "TransactionAmountVelocity".to_string(),
            PolicyType::TransactionAmountLimit => "TransactionAmountLimit".to_string(),
        }
    }
}
