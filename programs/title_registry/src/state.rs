use anchor_lang::prelude::*;

#[account()]
pub struct TitleRegistry {
    pub version: TitleRegistryVersion,
    pub asset_mint: Pubkey,
    pub authority: Pubkey,
    pub delegate: Pubkey,
    pub auditor: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum TitleRegistryVersion {
    V1,
}

impl TitleRegistry {
    pub const LEN: usize = 8 + 1 + 32 + 32;
    pub const CURRENT_VERSION: TitleRegistryVersion = TitleRegistryVersion::V1;
    pub const SEED: &[u8; 14] = b"title_registry";
}

#[account()]
pub struct TitleAccount {
    pub version: TitleAccountVersion,
    pub title_registry: Pubkey,
    pub nonce: Pubkey,
    pub uri: String,
    pub status: TitleAccountStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Default)]
pub enum TitleAccountStatus {
    #[default]
    Valid,
    Invalid,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum TitleAccountVersion {
    V1,
}

impl TitleAccount {
    pub const LEN: usize = 8 + 32 + 255;
    pub const CURRENT_VERSION: TitleAccountVersion = TitleAccountVersion::V1;
}
