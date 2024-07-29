use anchor_lang::{prelude::*, solana_program::program_option::COption};
use anchor_spl::token_interface::{
    memo_transfer_disable, MemoTransfer, Mint, Token2022, TokenAccount,
};

use crate::AssetControllerAccount;

#[derive(Accounts)]
#[instruction()]
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
    Ok(())
}
