use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateDataRegistry<'info> {
    #[account(
        constraint = authority.key() == data_registry.authority,
    )]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
}

pub fn handler(ctx: Context<DelegateDataRegistry>, delegate: Pubkey) -> Result<()> {
    ctx.accounts.data_registry.update_delegate(delegate);
    Ok(())
}
