pub const META_LIST_ACCOUNT_SEED: &[u8] = b"extra-account-metas";

pub mod registry;
pub mod track;
pub mod extensions;

pub use registry::*;
pub use track::*;
pub use extensions::*;

use anchor_lang::{solana_program::program_error::ProgramError, AnchorDeserialize, Discriminator};
use rwa_utils::GeyserProgramAccount;

pub enum AssetControllerAccounts {
    AssetControllerAccount(AssetControllerAccount),
    TrackerAccount(TrackerAccount),
}

impl GeyserProgramAccount for AssetControllerAccounts {
    fn discriminator(&self) -> &[u8] {
        match self {
            AssetControllerAccounts::AssetControllerAccount(_) => {
                AssetControllerAccount::DISCRIMINATOR
            }
            AssetControllerAccounts::TrackerAccount(_) => TrackerAccount::DISCRIMINATOR,
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
            TrackerAccount::DISCRIMINATOR => {
                let account = TrackerAccount::deserialize(account_data)?;
                Ok(AssetControllerAccounts::TrackerAccount(account))
            }
            _ => Err(ProgramError::InvalidAccountData),
        }
    }
}
