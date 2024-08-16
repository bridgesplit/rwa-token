pub mod account;
pub mod registry;

pub use account::*;
pub use registry::*;

use anchor_lang::{solana_program::program_error::ProgramError, AnchorDeserialize, Discriminator};
use rwa_utils::GeyserProgramAccount;

pub enum IdentityRegistryAccounts {
    IdentityAccount(IdentityAccount),
    IdentityRegistryAccount(IdentityRegistryAccount),
}

impl GeyserProgramAccount for IdentityRegistryAccounts {
    fn discriminator(&self) -> &[u8] {
        match self {
            IdentityRegistryAccounts::IdentityAccount(_) => IdentityAccount::DISCRIMINATOR,
            IdentityRegistryAccounts::IdentityRegistryAccount(_) => {
                IdentityRegistryAccount::DISCRIMINATOR
            }
        }
    }

    fn deserialize(data: &[u8]) -> Result<Self, ProgramError>
    where
        Self: Sized,
    {
        let discriminator = &data
            .get(..8)
            .map(|bytes| {
                let mut array = [0u8; 8];
                array.copy_from_slice(bytes);
                array
            })
            .ok_or(ProgramError::InvalidAccountData)?[..];
        let account_data = &mut &data[8..];
        match discriminator {
            IdentityAccount::DISCRIMINATOR => {
                let account = IdentityAccount::deserialize(account_data)?;
                Ok(IdentityRegistryAccounts::IdentityAccount(account))
            }
            IdentityRegistryAccount::DISCRIMINATOR => {
                let account = IdentityRegistryAccount::deserialize(account_data)?;
                Ok(IdentityRegistryAccounts::IdentityRegistryAccount(account))
            }
            _ => Err(ProgramError::InvalidAccountData),
        }
    }
}
