use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct DeleteDataAccount<'info> {
    #[account(
        constraint = data_registry.authority == signer.key() || data_registry.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account(
        constraint = data_registry.key() == data_account.data_registry
    )]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
    #[account(
        mut,
        close = signer,
    )]
    pub data_account: Box<Account<'info, DataAccount>>,
}
