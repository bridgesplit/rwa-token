use anchor_lang::prelude::*;

use crate::IdentityRegistryErrors;

#[account()]
#[derive(InitSpace)]
pub struct IdentityAccount {
    /// version of the account
    pub version: u8,
    /// identity registry to which the account belongs
    pub identity_registry: Pubkey,
    /// owner of the identity account
    pub owner: Pubkey,
    // identity levels corresponding to the user
    #[max_len(1)] // initial length is 1
    pub levels: Vec<u8>,
}

impl IdentityAccount {
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, owner: Pubkey, identity_registry: Pubkey, level: u8) {
        self.identity_registry = identity_registry;
        self.owner = owner;
        self.version = Self::VERSION;
        self.levels = vec![level];
    }

    pub fn add_level(&mut self, level: u8) -> Result<()> {
        if self.levels.contains(&level) {
            return Err(IdentityRegistryErrors::LevelAlreadyPresent.into());
        }
        self.levels.push(level);
        Ok(())
    }

    pub fn remove_level(&mut self, level: u8) -> Result<()> {
        if !self.levels.contains(&level) {
            return Err(IdentityRegistryErrors::LevelNotFound.into());
        }
        self.levels.retain(|&x| x != level);
        Ok(())
    }
}
