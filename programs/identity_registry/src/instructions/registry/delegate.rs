use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateIdentityRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = authority.key() == legal_registry.authority
    )]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [legal_registry.asset_mint.as_ref()],
        bump,
    )]
    pub legal_registry: Box<Account<'info, IdentityRegistry>>,
}

pub fn handler(ctx: Context<DelegateIdentityRegistry>, delegate: Pubkey) -> Result<()> {
    ctx.accounts.legal_registry.update_delegate(delegate);
    Ok(())
}
