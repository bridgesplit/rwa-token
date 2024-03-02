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
    pub fn new(
        &mut self,
        address: Pubkey,
        asset_mint: Pubkey,
        authority: Pubkey,
        delegate: Option<Pubkey>,
    ) {
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate.unwrap_or_else(|| address);
        self.version = Self::VERSION;
    }
    pub fn update_delegate(&mut self, delegate: Pubkey) {
        self.delegate = delegate;
    }
    pub fn verify_signer(&self, registry: Pubkey, signer: Pubkey, is_signer: bool) -> Result<()> {
        if signer == registry && self.delegate == registry {
            return Ok(());
        }
        if (signer == self.authority || signer == self.delegate) && is_signer {
            return Ok(());
        }
        Err(IdentityRegistryErrors::UnauthorizedSigner.into())
    }
}

#[account()]
#[derive(InitSpace)]
pub struct IdentityAccount {
    pub version: u8,
    pub registry: Pubkey,
    pub owner: Pubkey,
    // identity levels corresponding to the user
    pub levels: [u8; 10],
}

impl IdentityAccount {
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
