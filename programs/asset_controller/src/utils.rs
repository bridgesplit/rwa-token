use anchor_lang::{prelude::Result, solana_program::pubkey::Pubkey};
use spl_tlv_account_resolution::{
    account::ExtraAccountMeta, seeds::Seed, state::ExtraAccountMetaList,
};

use crate::id;

pub fn get_meta_list_size() -> Result<usize> {
    Ok(ExtraAccountMetaList::size_of(5).unwrap())
}

pub fn get_extra_account_metas() -> Result<Vec<ExtraAccountMeta>> {
    Ok(vec![
        // policy engine program
        ExtraAccountMeta::new_with_pubkey(&policy_engine::id(), false, false)?,
        // policy engine account
        ExtraAccountMeta::new_external_pda_with_seeds(
            5,
            &[Seed::AccountKey { index: 1 }],
            false,
            false,
        )?,
        // identity program
        ExtraAccountMeta::new_with_pubkey(&identity_registry::id(), false, false)?,
        // user identity account
        ExtraAccountMeta::new_external_pda_with_seeds(
            5,
            &[Seed::AccountKey { index: 1 }, Seed::AccountKey { index: 3 }],
            false,
            false,
        )?,
        // user tracker account
        ExtraAccountMeta::new_with_seeds(
            &[Seed::AccountKey { index: 1 }, Seed::AccountKey { index: 3 }],
            false,
            true,
        )?,
    ])
}

pub fn get_transaction_approval_account_pda(mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[mint.as_ref()], &id()).0
}
