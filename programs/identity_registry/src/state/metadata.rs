use anchor_lang::prelude::*;

use crate::IdentityRegistryErrors;

#[account()]
#[derive(InitSpace)]
pub struct IdentityMetadataAccount {
    /// version of the account
    pub version: u8,
    /// identity registry to which the account belongs
    pub identity_registry: Pubkey,
    /// identity level
    pub level: u8,
    /// current number of users
    pub current_users: u64,
    /// max number of users
    pub max_users: u64,
}

impl IdentityMetadataAccount {
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, identity_registry: Pubkey, level: u8, max_users: u64) {
        self.identity_registry = identity_registry;
        self.level = level;
        self.version = Self::VERSION;
        self.current_users = 0;
        self.max_users = max_users;
    }

    pub fn add_user(&mut self) -> Result<()> {
        if self.current_users >= self.max_users {
            return Err(IdentityRegistryErrors::LimitReached.into());
        }
        self.current_users += 1;
        Ok(())
    }

    pub fn remove_user(&mut self) -> Result<()> {
        self.current_users -= 1;
        Ok(())
    }
}
