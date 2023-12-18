use anchor_lang::prelude::*;

#[account()]
pub struct IdentityRegistry {
    pub version: IdentityRegistryVersion,
    pub asset_mint: Pubkey,
    pub authority: Pubkey,
    pub delegate: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum IdentityRegistryVersion {
    V1,
}

impl IdentityRegistry {
    pub const LEN: usize = 8 + 1 + 32 + 32;
    pub const CURRENT_VERSION: IdentityRegistryVersion = IdentityRegistryVersion::V1;
    pub const SEED: &[u8; 17] = b"identity_registry";
}

#[account()]
pub struct IdentityAccount {
    pub version: IdentityAccountVersion,
    pub owner: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum IdentityAccountVersion {
    V1,
}

impl IdentityAccount {
    pub const LEN: usize = 8;
    pub const CURRENT_VERSION: IdentityAccountVersion = IdentityAccountVersion::V1;
}
