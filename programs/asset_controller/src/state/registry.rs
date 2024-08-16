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
    pub fn new(&mut self, asset_mint: Pubkey, authority: Pubkey, delegate: Option<Pubkey>) {
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate.unwrap_or(authority);
        self.version = Self::VERSION;
    }
}

#[event]
pub struct AssetMetadataEvent {
    pub mint: String,
    pub name: Option<String>,
    pub symbol: Option<String>,
    pub uri: Option<String>,
    pub decimals: Option<u8>,
}

#[event]
pub struct ExtensionMetadataEvent {
    pub address: String,
    pub extension_type: u8,
    pub metadata: Vec<u8>,
}
