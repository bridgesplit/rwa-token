use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct DelegateIdentityRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [legal_registry.asset_mint.as_ref()],
        bump,
        constraint = legal_registry.authority == authority.key()
    )]
    pub legal_registry: Box<Account<'info, IdentityRegistry>>,
}

pub fn handler(ctx: Context<DelegateIdentityRegistry>, delegate: Pubkey) -> Result<()> {
    let legal_registry = &mut ctx.accounts.legal_registry;
    legal_registry.delegate = delegate;
    Ok(())
}
