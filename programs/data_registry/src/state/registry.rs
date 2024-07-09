use anchor_lang::prelude::*;

#[account()]
#[derive(InitSpace)]
pub struct DataRegistryAccount {
    pub version: u8,
    pub asset_mint: Pubkey,
    /// can sign creation of new data accounts
    /// can update delegate
    /// can update data account authority
    pub authority: Pubkey,
    /// can sign creation of new data accounts, can be used if a different org needs to issue data accounts
    pub delegate: Pubkey,
}

impl DataRegistryAccount {
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, asset_mint: Pubkey, authority: Pubkey, delegate: Option<Pubkey>) {
        self.version = Self::VERSION;
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate.unwrap_or(authority);
    }
    pub fn update_delegate(&mut self, delegate: Pubkey) {
        self.delegate = delegate;
    }
}
