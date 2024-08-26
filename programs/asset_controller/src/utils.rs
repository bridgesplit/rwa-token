use anchor_lang::{
    prelude::Result,
    solana_program::{
        program::invoke,
        system_instruction::transfer,
        sysvar::{self},
    },
    Lamports,
};
use spl_tlv_account_resolution::{
    account::ExtraAccountMeta, seeds::Seed, state::ExtraAccountMetaList,
};

use crate::{AccountInfo, Rent, SolanaSysvar};

pub fn get_meta_list_size() -> Result<usize> {
    Ok(ExtraAccountMetaList::size_of(get_extra_account_metas()?.len()).unwrap())
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
        // identity registry account
        ExtraAccountMeta::new_external_pda_with_seeds(
            7,
            &[Seed::AccountKey { index: 1 }],
            false,
            false,
        )?,
        // user identity account
        ExtraAccountMeta::new_external_pda_with_seeds(
            7,
            &[
                Seed::AccountKey { index: 8 },
                Seed::AccountData {
                    account_index: 2,
                    data_index: 32,
                    length: 32,
                },
            ],
            false,
            true,
        )?,
        // user tracker account
        ExtraAccountMeta::new_external_pda_with_seeds(
            5,
            &[
                Seed::AccountKey { index: 1 },
                Seed::AccountData {
                    account_index: 2,
                    data_index: 32,
                    length: 32,
                },
            ],
            false,
            true,
        )?,
        // policy account
        ExtraAccountMeta::new_external_pda_with_seeds(
            5,
            &[Seed::AccountKey { index: 6 }],
            false,
            false,
        )?,
        // instructions program
        ExtraAccountMeta::new_with_pubkey(&sysvar::instructions::id(), false, false)?,
    ])
}

pub fn update_account_lamports_to_minimum_balance<'info>(
    account: AccountInfo<'info>,
    payer: AccountInfo<'info>,
    system_program: AccountInfo<'info>,
) -> Result<()> {
    let min_balance = Rent::get()?.minimum_balance(account.data_len());
    if min_balance > account.get_lamports() {
        invoke(
            &transfer(payer.key, account.key, min_balance - account.get_lamports()),
            &[payer, account, system_program],
        )?;
    }
    Ok(())
}
