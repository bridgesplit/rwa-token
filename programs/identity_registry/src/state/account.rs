use anchor_lang::prelude::*;

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

/// level if attached to user account, will skip any policy checks
pub const SKIP_POLICY_LEVEL: u8 = u8::MAX;

/// level to be used if user does not have any identity
pub const NO_IDENTITY_DEFAULT_LEVEL: u8 = u8::MIN;

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
