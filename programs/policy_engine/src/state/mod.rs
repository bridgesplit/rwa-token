pub mod account;
pub mod engine;

pub use account::*;
pub use engine::*;

use anchor_lang::{solana_program::program_error::ProgramError, AnchorDeserialize, Discriminator};
use rwa_utils::GeyserProgramAccount;

pub enum PolicyEngineAccounts {
    PolicyAccount(PolicyAccount),
    PolicyEngineAccount(PolicyEngineAccount),
}

impl GeyserProgramAccount for PolicyEngineAccounts {
    fn discriminator(&self) -> &[u8] {
        match self {
            PolicyEngineAccounts::PolicyAccount(_) => PolicyAccount::DISCRIMINATOR,
            PolicyEngineAccounts::PolicyEngineAccount(_) => PolicyEngineAccount::DISCRIMINATOR,
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
            PolicyAccount::DISCRIMINATOR => {
                let account = PolicyAccount::deserialize(account_data)?;
                Ok(PolicyEngineAccounts::PolicyAccount(account))
            }
            PolicyEngineAccount::DISCRIMINATOR => {
                let account = PolicyEngineAccount::deserialize(account_data)?;
                Ok(PolicyEngineAccounts::PolicyEngineAccount(account))
            }
            _ => Err(ProgramError::InvalidAccountData),
        }
    }
}
