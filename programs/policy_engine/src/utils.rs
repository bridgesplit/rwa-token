use crate::{state::*, PolicyEngineErrors};
use anchor_lang::{
    prelude::*,
    solana_program::sysvar::{self, instructions::get_instruction_relative},
};
use anchor_spl::token_2022;
use spl_tlv_account_resolution::{
    account::ExtraAccountMeta, seeds::Seed, state::ExtraAccountMetaList,
};

pub fn enforce_identity_filter(identity: &[u8], identity_filter: IdentityFilter) -> Result<()> {
    match identity_filter.comparision_type {
        ComparisionType::Or => {
            // if any level is in the identities array, return Ok
            for level in identity.iter() {
                if *level != 0 && identity_filter.identity_levels.contains(level) {
                    return Ok(());
                }
            }
            Err(PolicyEngineErrors::IdentityFilterFailed.into())
        }
        ComparisionType::And => {
            // if all levels are in the identities array, return Ok
            for level in identity_filter.identity_levels.iter() {
                if *level != 0 && !identity.contains(level) {
                    return Err(PolicyEngineErrors::IdentityFilterFailed.into());
                }
            }
            Ok(())
        }
    }
}

pub fn get_total_amount_transferred_in_timeframe(
    transfers: &Vec<Transfer>,
    timeframe: i64,
    timestamp: i64,
) -> u64 {
    let mut total_amount_transferred = 0;
    let min_timestamp = timestamp - timeframe;
    for transfer in transfers {
        if transfer.timestamp >= min_timestamp {
            total_amount_transferred += transfer.amount;
        }
    }
    total_amount_transferred
}

pub fn get_total_transactions_in_timeframe(
    transfers: &Vec<Transfer>,
    timeframe: i64,
    timestamp: i64,
) -> u64 {
    let mut total_transactions = 0;
    let min_timestamp = timestamp - timeframe;
    for transfer in transfers {
        if transfer.timestamp >= min_timestamp {
            total_transactions += 1;
        }
    }
    total_transactions
}

#[derive(InitSpace, AnchorDeserialize, AnchorSerialize, Copy, Clone)]
pub struct Transfer {
    pub amount: u64,
    pub timestamp: i64,
}

pub const TRANSFER_HOOK_MINT_INDEX: usize = 1;

pub fn verify_cpi_program_is_token22(
    instructions_program: &AccountInfo,
    amount: u64,
    mint: Pubkey,
) -> Result<()> {
    let ix_relative = get_instruction_relative(0, instructions_program)?;
    if ix_relative.program_id != token_2022::ID {
        return Err(PolicyEngineErrors::InvalidCpiTransferProgram.into());
    }
    if ix_relative.data[1..9] != amount.to_le_bytes() {
        return Err(PolicyEngineErrors::InvalidCpiTransferAmount.into());
    }
    // make sure transfer mint is same
    if let Some(account) = ix_relative.accounts.get(TRANSFER_HOOK_MINT_INDEX) {
        if account.pubkey != mint {
            return Err(PolicyEngineErrors::InvalidCpiTransferMint.into());
        }
    } else {
        return Err(PolicyEngineErrors::InvalidCpiTransferProgram.into());
    }

    Ok(())
}

#[inline(never)]
pub fn verify_pda(address: Pubkey, seeds: &[&[u8]], program_id: &Pubkey) -> Result<()> {
    let (pda, _) = Pubkey::find_program_address(seeds, program_id);
    if pda != address {
        return Err(PolicyEngineErrors::InvalidPdaPassedIn.into());
    }
    Ok(())
}

pub fn get_meta_list_size() -> Result<usize> {
    Ok(ExtraAccountMetaList::size_of(get_extra_account_metas()?.len()).unwrap())
}

pub fn get_extra_account_metas() -> Result<Vec<ExtraAccountMeta>> {
    Ok(vec![
        // policy engine account
        ExtraAccountMeta::new_with_seeds(&[Seed::AccountKey { index: 1 }], false, false)?,
        // identity program
        ExtraAccountMeta::new_with_pubkey(&identity_registry::id(), false, false)?,
        // identity registry account
        ExtraAccountMeta::new_external_pda_with_seeds(
            6,
            &[Seed::AccountKey { index: 1 }],
            false,
            false,
        )?,
        // user identity account
        ExtraAccountMeta::new_external_pda_with_seeds(
            6,
            &[
                Seed::AccountKey { index: 7 },
                Seed::AccountData {
                    // to pubkey
                    account_index: 2, // to token account
                    data_index: 32,
                    length: 32,
                },
            ],
            false,
            false,
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
        ExtraAccountMeta::new_with_seeds(&[Seed::AccountKey { index: 5 }], false, true)?,
        // instructions program
        ExtraAccountMeta::new_with_pubkey(&sysvar::instructions::id(), false, false)?,
    ])
}
