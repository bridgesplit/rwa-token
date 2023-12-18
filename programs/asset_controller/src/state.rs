use anchor_lang::prelude::*;
use anchor_lang::solana_program::slot_history::Slot;

pub const ASSET_CONTROLLER_DATA_SEED: &str = "asset_controller_data";

#[account()]
pub struct AssetControllerData {
    pub version: AssetControllerDataVersion,
    pub asset_mint: Pubkey,
    pub transaction_approval_authority: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Default)]
pub enum AssetControllerDataVersion {
    #[default]
    V1,
}

impl AssetControllerData {
    pub const LEN: usize = 8 + 32 + 32;
    pub const CURRENT_VERSION: AssetControllerDataVersion = AssetControllerDataVersion::V1;
}

pub const TRANSACTION_APPROVAL_ACCOUNT_SEED: &str = "transaction_approval_account";

#[account()]
pub struct TransactionApprovalAccount {
    pub nonce: Pubkey,
    pub owner: Pubkey,
    pub approval_authority: Pubkey,
    pub asset_mint: Pubkey,
    pub amount: Option<u64>,
    pub instruction_name: String,
    pub slot: Slot,
}

impl TransactionApprovalAccount {
    pub const LEN: usize = 32 + 32 + 8 + 255 + 8;
}
