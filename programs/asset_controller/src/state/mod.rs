pub mod registry;

pub use registry::*;

use anchor_lang::{solana_program::program_error::ProgramError, AnchorDeserialize, Discriminator};
use rwa_utils::GeyserProgramAccount;

pub enum AssetControllerAccounts {
    AssetControllerAccount(AssetControllerAccount),
}

impl GeyserProgramAccount for AssetControllerAccounts {
    fn discriminator(&self) -> &[u8] {
        match self {
            AssetControllerAccounts::AssetControllerAccount(_) => {
                AssetControllerAccount::DISCRIMINATOR
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
            AssetControllerAccount::DISCRIMINATOR => {
                let account = AssetControllerAccount::deserialize(account_data)?;
                Ok(AssetControllerAccounts::AssetControllerAccount(account))
            }
            _ => Err(ProgramError::InvalidAccountData),
        }
    }
}
