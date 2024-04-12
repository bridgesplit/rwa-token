use anchor_lang::prelude::*;

#[error_code]
pub enum DataRegistryErrors {
    #[msg("The signer is not authorized to perform this action")]
    UnauthorizedSigner,
}
