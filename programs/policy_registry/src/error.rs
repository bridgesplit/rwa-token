use anchor_lang::prelude::*;

#[error_code]
pub enum PolicyRegistryErrors {
    #[msg("Invalid policy account passed")]
    InvalidPolicy,
    #[msg("Transaction amount limit exceeded")]
    TransactionAmountLimitExceeded,
    #[msg("Transaction amount velocity exceeded")]
    TransactionAmountVelocityExceeded,
    #[msg("Transaction count velocity exceeded")]
    TransactionCountVelocityExceeded,
    #[msg("Policy registry is full, cannot add more policies")]
    PolicyRegistryFull,
    #[msg("Policy not found")]
    PolicyNotFound,
    #[msg("Identity filter failed")]
    IdentityFilterFailed,
    #[msg("Transfer history is full")]
    TransferHistoryFull,
}
