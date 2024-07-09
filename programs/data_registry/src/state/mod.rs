pub mod account;
pub mod registry;

pub use account::*;
pub use registry::*;

use anchor_lang::{solana_program::program_error::ProgramError, AnchorDeserialize, Discriminator};
use rwa_utils::GeyserProgramAccount;

pub enum DataRegistryAccounts {
    DataAccount(DataAccount),
    DataRegistryAccount(DataRegistryAccount),
}

impl GeyserProgramAccount for DataRegistryAccounts {
    fn discriminator(&self) -> [u8; 8] {
        match self {
            DataRegistryAccounts::DataAccount(_) => DataAccount::DISCRIMINATOR,
            DataRegistryAccounts::DataRegistryAccount(_) => DataRegistryAccount::DISCRIMINATOR,
        }
    }

    fn deserialize(data: &[u8]) -> Result<Self, ProgramError>
    where
        Self: Sized,
    {
        let discriminator = data
            .get(..8)
            .map(|bytes| {
                let mut array = [0u8; 8];
                array.copy_from_slice(bytes);
                array
            })
            .ok_or(ProgramError::InvalidAccountData)?;
        let account_data = &mut &data[8..];
        match discriminator {
            DataAccount::DISCRIMINATOR => {
                let account = DataAccount::deserialize(account_data)?;
                Ok(DataRegistryAccounts::DataAccount(account))
            }
            DataRegistryAccount::DISCRIMINATOR => {
                let account = DataRegistryAccount::deserialize(account_data)?;
                Ok(DataRegistryAccounts::DataRegistryAccount(account))
            }
            _ => Err(ProgramError::InvalidAccountData),
        }
    }
}
