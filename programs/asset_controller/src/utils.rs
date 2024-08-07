use anchor_lang::{
    prelude::Result,
    solana_program::{
        program::invoke,
        pubkey::Pubkey,
        system_instruction::transfer,
        sysvar::{self, instructions::get_instruction_relative},
    },
    Lamports,
};
use anchor_spl::token_2022;
use spl_tlv_account_resolution::{
    account::ExtraAccountMeta, seeds::Seed, state::ExtraAccountMetaList,
};

use crate::{id, AccountInfo, AssetControllerErrors, Rent, SolanaSysvar};

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
        ExtraAccountMeta::new_with_seeds(
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

pub fn get_transaction_approval_account_pda(mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[mint.as_ref()], &id()).0
}

pub fn update_account_lamports_to_minimum_balance<'info>(
    account: AccountInfo<'info>,
    payer: AccountInfo<'info>,
    system_program: AccountInfo<'info>,
) -> Result<()> {
    let extra_lamports = Rent::get()?.minimum_balance(account.data_len()) - account.get_lamports();
    if extra_lamports > 0 {
        invoke(
            &transfer(payer.key, account.key, extra_lamports),
            &[payer, account, system_program],
        )?;
    }
    Ok(())
}

#[inline(never)]
pub fn verify_pda(address: Pubkey, seeds: &[&[u8]], program_id: &Pubkey) -> Result<()> {
    let (pda, _) = Pubkey::find_program_address(seeds, program_id);
    if pda != address {
        return Err(AssetControllerErrors::InvalidPdaPassedIn.into());
    }
    Ok(())
}

pub const TRANSFER_HOOK_MINT_INDEX: usize = 1;

pub fn verify_cpi_program_is_token22(
    instructions_program: &AccountInfo,
    amount: u64,
    mint: Pubkey,
) -> Result<()> {
    let ix_relative = get_instruction_relative(0, instructions_program)?;
    if ix_relative.program_id != token_2022::ID {
        return Err(AssetControllerErrors::InvalidCpiTransferProgram.into());
    }
    if ix_relative.data[1..9] != amount.to_le_bytes() {
        return Err(AssetControllerErrors::InvalidCpiTransferAmount.into());
    }
    // make sure transfer mint is same
    if let Some(account) = ix_relative.accounts.get(TRANSFER_HOOK_MINT_INDEX) {
        if account.pubkey != mint {
            return Err(AssetControllerErrors::InvalidCpiTransferMint.into());
        }
    } else {
        return Err(AssetControllerErrors::InvalidCpiTransferProgram.into());
    }

    Ok(())
}
