use anchor_lang::prelude::*;

use crate::IdentityRegistryErrors;

#[account()]
pub struct IdentityRegistry {
    pub version: u8,
    pub asset_mint: Pubkey,
    pub authority: Pubkey,
    pub delegate: Pubkey,
}

impl IdentityRegistry {
    pub const LEN: usize = 8 + 1 + 32 + 32 + 32;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, asset_mint: Pubkey, authority: Pubkey, delegate: Pubkey) {
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate;
        self.version = Self::VERSION;
    }
    pub fn check_authority(&self, authority: Pubkey) -> Result<()> {
        if authority != self.authority {
            return Err(IdentityRegistryErrors::UnauthorizedSigner.into());
        }
        Ok(())
    }
}

#[account()]
pub struct IdentityAccount {
    pub version: u8,
    pub registry: Pubkey,
    pub owner: Pubkey,
    pub levels: [u8; 10],
}

impl IdentityAccount {
    pub const LEN: usize = 8 + 1 + 32 + 32 + 10;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, owner: Pubkey, registry: Pubkey, level: u8) {
        self.registry = registry;
        self.owner = owner;
        self.version = Self::VERSION;
        self.levels[0] = level;
    }

    pub fn add_level(&mut self, level: u8) -> Result<()> {
        // find and replace first 0, if not return error
        for i in 0..self.levels.len() {
            if self.levels[i] == 0 {
                self.levels[i] = level;
                return Ok(());
            }
        }
        Err(IdentityRegistryErrors::MaxLevelsExceeded.into())
    }

    pub fn remove_level(&mut self, level: u8) -> Result<()> {
        // find and replace first level, arrange to move all levels to the left
        for i in 0..self.levels.len() {
            if self.levels[i] == level {
                for j in i..self.levels.len() - 1 {
                    self.levels[j] = self.levels[j + 1];
                }
                self.levels[self.levels.len() - 1] = 0;
                return Ok(());
            }
        }
        Err(IdentityRegistryErrors::LevelNotFound.into())
    }
}
