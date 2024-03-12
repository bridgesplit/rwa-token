use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

/// Represents a delegate asset instruction and its associated accounts for data registry.
#[derive(Accounts)]
#[instruction()]
pub struct DelegateDataRegistry<'info> {
    #[account(
        constraint = authority.key() == data_registry.authority,
    )]
    pub authority: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut)]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
}


/// This instruction allows the authority to delegate an asset to another entity.
pub fn handler(ctx: Context<DelegateDataRegistry>, delegate: Pubkey) -> Result<()> {
    ctx.accounts.data_registry.update_delegate(delegate);
    Ok(())
}
