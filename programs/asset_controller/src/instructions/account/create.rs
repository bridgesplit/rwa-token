use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::spl_token_2022::{extension::ExtensionType, instruction::reallocate},
    token_interface::{memo_transfer_initialize, MemoTransfer, Mint, Token2022, TokenAccount},
};

use crate::{AssetControllerAccount, ExtensionMetadataEvent};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateTokenAccountArgs {
    pub memo_transfer: bool,
}

#[derive(Accounts)]
#[instruction()]
#[event_cpi]
pub struct CreateTokenAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: can be any account
    pub owner: UncheckedAccount<'info>,
    // Note: All ATAs are are initialized with ImmutableOwner because the mint is created with Token22.
    #[account(
        mint::token_program = token_program,
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::token_program = token_program,
        associated_token::mint = asset_mint,
        associated_token::authority = owner,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        seeds = [asset_mint.key().as_ref()],
        bump,
    )]
    pub asset_controller: Account<'info, AssetControllerAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CreateTokenAccount<'info> {
    #[allow(clippy::needless_borrow)]
    fn reallocate_ta(&self, extensions: Vec<ExtensionType>) -> Result<()> {
        let ix = reallocate(
            &self.token_program.key,
            &self.token_account.key(),
            self.payer.key,
            self.owner.key,
            &[],
            &extensions,
        )?;
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                self.token_account.to_account_info(),
                self.payer.to_account_info(),
                self.system_program.to_account_info(),
                self.owner.to_account_info(),
            ],
        )?;
        Ok(())
    }

    fn enable_memo_transfer(&self) -> Result<()> {
        let cpi_accounts = MemoTransfer {
            token_program_id: self.token_program.to_account_info(),
            account: self.token_account.to_account_info(),
            owner: self.owner.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        memo_transfer_initialize(cpi_ctx)?;
        Ok(())
    }
}

pub const TOKEN_EXTENSIONS: [ExtensionType; 1] = [ExtensionType::MemoTransfer];

pub fn handler(ctx: Context<CreateTokenAccount>, args: CreateTokenAccountArgs) -> Result<()> {
    if args.memo_transfer {
        ctx.accounts.reallocate_ta(TOKEN_EXTENSIONS.to_vec())?;
        ctx.accounts.enable_memo_transfer()?;
        emit_cpi!(ExtensionMetadataEvent {
            address: ctx.accounts.token_account.key().to_string(),
            extension_type: ExtensionType::MemoTransfer as u8,
            metadata: vec![1]
        });
    }

    Ok(())
}
