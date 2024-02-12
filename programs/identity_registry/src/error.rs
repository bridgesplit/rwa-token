use anchor_lang::prelude::*;

#[error_code]
pub enum IdentityErrors {
    #[msg("Identity level has already been attached to user")]
    LevelAlreadyPresent,
    #[msg("Number of levels that can be attached to user has been exceeded")]
    MaxLevelsExceeded,
    #[msg("Level to be removed not found")]
    LevelNotFound,
}
