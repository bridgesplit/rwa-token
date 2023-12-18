use anchor_lang::prelude::*;

#[account()]
pub struct LegalRegistry {
    pub version: LegalRegistryVersion,
    pub asset_mint: Pubkey,
    pub authority: Pubkey,
    pub delegate: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum LegalRegistryVersion {
    V1,
}

impl LegalRegistry {
    pub const LEN: usize = 8 + 1 + 32 + 32;
    pub const CURRENT_VERSION: LegalRegistryVersion = LegalRegistryVersion::V1;
    pub const SEED: &[u8; 14] = b"legal_registry";
}

#[account()]
pub struct LegalAccount {
    pub version: LegalAccountVersion,
    pub legal_registry: Pubkey,
    pub nonce: Pubkey,
    pub uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum LegalAccountVersion {
    V1,
}

impl LegalAccount {
    pub const LEN: usize = 8 + 32 + 255;
    pub const CURRENT_VERSION: LegalAccountVersion = LegalAccountVersion::V1;
}
