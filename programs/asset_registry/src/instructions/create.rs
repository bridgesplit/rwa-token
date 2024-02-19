/// creates a mint a new asset
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{spl_token_2022::extension::ExtensionType, Mint, Token2022};
use spl_tlv_account_resolution::{account::ExtraAccountMeta, state::ExtraAccountMetaList};
use spl_transfer_hook_interface::instruction::ExecuteInstruction;

use crate::{get_meta_list_size, get_transaction_approval_account_pda, state::*};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateAssetRegistryArgs {
    pub decimals: u8,
    pub authority: Pubkey,
    pub delegate: Option<Pubkey>,
}

pub const MINT_EXTENSIONS: [ExtensionType; 1] = [ExtensionType::TransferHook];

#[derive(Accounts)]
#[instruction(args: CreateAssetRegistryArgs)]
pub struct CreateAssetRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        signer,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = args.decimals,
        mint::authority = args.authority,
        mint::freeze_authority = args.authority,
        mint::extensions = MINT_EXTENSIONS.to_vec(),
        extensions::transfer_hook::authority = args.authority,
        extensions::transfer_hook::program_id = crate::id(),
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        payer = payer,
        space = AssetRegistryAccount::LEN,
        seeds = [asset_mint.key().as_ref()],
        bump,
    )]
    pub asset_registry: Box<Account<'info, AssetRegistryAccount>>,
    #[account(
        init,
        space = get_meta_list_size(),
        seeds = [META_LIST_ACCOUNT_SEED, asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    /// CHECK: extra metas account
    pub extra_metas_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(ctx: Context<CreateAssetRegistry>, args: CreateAssetRegistryArgs) -> Result<()> {
    let delegate = match args.delegate {
        Some(delegate) => delegate,
        None => ctx.accounts.asset_registry.key(),
    };
    ctx.accounts
        .asset_registry
        .new(ctx.accounts.asset_mint.key(), args.authority, delegate);

    // initialize the extra metas account
    let extra_metas_account = &ctx.accounts.extra_metas_account;
    let metas = vec![
        // transaction approval account
        ExtraAccountMeta {
            discriminator: 0,
            address_config: get_transaction_approval_account_pda(ctx.accounts.asset_mint.key())
                .to_bytes(),
            is_signer: false.into(),
            is_writable: true.into(),
        },
    ];
    let mut data = extra_metas_account.try_borrow_mut_data()?;
    ExtraAccountMetaList::init::<ExecuteInstruction>(&mut data, &metas)?;

    Ok(())
}
