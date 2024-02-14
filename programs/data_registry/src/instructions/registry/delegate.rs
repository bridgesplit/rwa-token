use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateDataRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = authority.key() == data_registry.authority,
    )]
    pub authority: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        seeds = [data_registry.asset_mint.as_ref()],
        bump,
    )]
    pub data_registry: Box<Account<'info, DataRegistry>>,
}

pub fn handler(ctx: Context<DelegateDataRegistry>, delegate: Pubkey) -> Result<()> {
    ctx.accounts.data_registry.update_delegate(delegate);
    Ok(())
}
