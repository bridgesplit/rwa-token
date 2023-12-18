use anchor_lang::prelude::*;

#[account()]
pub struct DataRegistry {
    pub version: DataRegistryVersion,
    pub asset_mint: Pubkey,
    pub authority: Pubkey,
    pub delegate: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum DataRegistryVersion {
    V1,
}

impl DataRegistry {
    pub const LEN: usize = 8 + 1 + 32 + 32;
    pub const CURRENT_VERSION: DataRegistryVersion = DataRegistryVersion::V1;
    pub const SEED: &[u8; 13] = b"data_registry";
}

#[account()]
pub struct DataAccount {
    pub version: DataAccountVersion,
    pub nonce: Pubkey,
    pub data_registry: Pubkey,
    pub data: [u8; 1024],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum DataAccountVersion {
    V1,
}

impl DataAccount {
    pub const LEN: usize = 8 + 32 + 255;
    pub const CURRENT_VERSION: DataAccountVersion = DataAccountVersion::V1;
}
