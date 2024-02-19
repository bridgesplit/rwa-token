use anchor_lang::solana_program::pubkey::Pubkey;
use spl_tlv_account_resolution::state::ExtraAccountMetaList;

use crate::id;

pub fn get_meta_list_size() -> usize {
    ExtraAccountMetaList::size_of(1).unwrap()
}

pub fn get_transaction_approval_account_pda(mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[mint.as_ref()], &id()).0
}
