use anchor_lang::prelude::*;

#[account()]
#[derive(InitSpace)]
pub struct AssetControllerAccount {
    pub version: u8,
    /// mint pubkey
    pub asset_mint: Pubkey,
    /// authority has the ability to change delegate, freeze token accounts, etc.
    pub authority: Pubkey,
    /// delegate has the ability to generate tranasction approval accounts,
    /// by default points to self, which allows any programs to generate an approval account
    /// update to any other account to control cpis
    pub delegate: Pubkey,
}

impl AssetControllerAccount {
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, asset_mint: Pubkey, authority: Pubkey, delegate: Pubkey) {
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate;
        self.version = Self::VERSION;
    }
}
