use anchor_lang::solana_program::pubkey::Pubkey;

pub fn get_identity_registry_pda(asset_mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[asset_mint.as_ref()], &crate::ID).0
}
