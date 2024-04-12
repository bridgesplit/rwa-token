use anchor_lang::prelude::*;

use crate::IdentityRegistryErrors;

#[account()]
#[derive(InitSpace)]
pub struct IdentityRegistryAccount {
    pub version: u8,
    /// corresponding asset mint
    pub asset_mint: Pubkey,
    /// authority to manage the registry
    pub authority: Pubkey,
    /// registry delegate
    pub delegate: Pubkey,
}

// level if attached to user account, will skip any policy checks
pub const SKIP_POLICY_LEVEL: u8 = u8::MAX;

impl IdentityRegistryAccount {
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, asset_mint: Pubkey, authority: Pubkey, delegate: Option<Pubkey>) {
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate.unwrap_or(authority);
        self.version = Self::VERSION;
    }
    pub fn update_delegate(&mut self, delegate: Pubkey) {
        self.delegate = delegate;
    }
}

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
