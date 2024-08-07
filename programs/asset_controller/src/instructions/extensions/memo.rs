use anchor_lang::prelude::*;
use anchor_spl::token_interface::{memo_transfer_disable, MemoTransfer, Token2022, TokenAccount};
use spl_token_2022::extension::ExtensionType;

use crate::ExtensionMetadataEvent;

#[derive(Accounts)]
#[instruction()]
#[event_cpi]
pub struct DisableMemoTransfer<'info> {
    #[account()]
    pub owner: Signer<'info>,
    #[account(
        mut,
        constraint = token_account.owner == owner.key(),
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub token_program: Program<'info, Token2022>,
}

impl<'info> DisableMemoTransfer<'info> {
    fn disable_memo_transfer(&self) -> Result<()> {
        let cpi_accounts = MemoTransfer {
            token_program_id: self.token_program.to_account_info(),
            account: self.token_account.to_account_info(),
            owner: self.owner.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        memo_transfer_disable(cpi_ctx)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<DisableMemoTransfer>) -> Result<()> {
    ctx.accounts.disable_memo_transfer()?;
    emit_cpi!(ExtensionMetadataEvent {
        address: ctx.accounts.token_account.key().to_string(),
        extension_type: ExtensionType::MemoTransfer as u8,
        metadata: vec![0]
    });
    Ok(())
}
