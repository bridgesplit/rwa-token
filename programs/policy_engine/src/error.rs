use anchor_lang::prelude::*;

#[error_code]
pub enum PolicyEngineErrors {
    #[msg("Invalid policy passed")]
    InvalidPolicy,
    #[msg("Transaction amount limit exceeded")]
    TransactionAmountLimitExceeded,
    #[msg("Transaction amount velocity exceeded")]
    TransactionAmountVelocityExceeded,
    #[msg("Transaction count velocity exceeded")]
    TransactionCountVelocityExceeded,
    #[msg("Policy registry is full, cannot add more policies")]
    PolicyEngineFull,
    #[msg("Policy not found")]
    PolicyNotFound,
    #[msg("Identity filter failed")]
    IdentityFilterFailed,
    #[msg("Unauthorized signer")]
    UnauthorizedSigner,
    #[msg("Policy already exists")]
    PolicyAlreadyExists,
}
