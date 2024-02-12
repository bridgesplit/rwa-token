use anchor_lang::prelude::*;

#[error_code]
pub enum PolicyEngineErrors {
    #[msg("Invalid policy account passed")]
    InvalidPolicy,
    #[msg("Transaction amount velocity reached")]
    TransactionAmountVelocityReached,
    #[msg("Transaction count velocity reached")]
    TransactionCountVelocityReached,
}
