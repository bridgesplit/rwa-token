use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateIdentityRegistry<'info> {
    #[account(
        constraint = authority.key() == identity_registry_account.authority
    )]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub identity_registry_account: Box<Account<'info, IdentityRegistryAccount>>,
}


/// Updates the delegate of the identity registry.
pub fn handler(ctx: Context<DelegateIdentityRegistry>, delegate: Pubkey) -> Result<()> {
    ctx.accounts
        .identity_registry_account
        .update_delegate(delegate);
    Ok(())
}
