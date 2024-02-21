use anchor_lang::solana_program::pubkey::Pubkey;

pub fn get_bump_in_seed_form(bump: &u8) -> [u8; 1] {
    let bump_val = *bump;
    [bump_val]
}

pub fn get_identity_registry_pda(asset_mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[asset_mint.as_ref()], &crate::ID).0
}
