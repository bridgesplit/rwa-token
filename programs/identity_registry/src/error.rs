use anchor_lang::prelude::*;

#[error_code]
pub enum IdentityRegistryErrors {
    #[msg("Identity level has already been attached to user")]
    LevelAlreadyPresent,
    #[msg("Number of levels that can be attached to user has been exceeded")]
    MaxLevelsExceeded,
    #[msg("Level to be removed not found")]
    LevelNotFound,
    #[msg("Unauthorized signer")]
    UnauthorizedSigner,
    #[msg("Identity limit reached")]
    LimitReached,
}
