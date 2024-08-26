use anchor_lang::error_code;

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
    #[msg("Identity level limit exceeded")]
    IdentityLevelLimitExceeded,
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
    #[msg("Max balance exceeded")]
    MaxBalanceExceeded,
    #[msg("Invalid CPI transfer amount")]
    InvalidCpiTransferAmount,
    #[msg("Invalid CPI transfer mint")]
    InvalidCpiTransferMint,
    #[msg("Invalid CPI transfer program")]
    InvalidCpiTransferProgram,
    #[msg("Invalid PDA passed in")]
    InvalidPdaPassedIn,
    #[msg("Transfer history full")]
    TransferHistoryFull,
}
