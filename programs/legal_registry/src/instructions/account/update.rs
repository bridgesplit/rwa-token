use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(uri: String)]
pub struct RevokeLegalAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [legal_registry.asset_mint.key().as_ref(), LegalRegistry::SEED],
        bump,
        constraint = legal_registry.authority == authority.key(),
    )]
    pub legal_registry: Box<Account<'info, LegalRegistry>>,
    #[account(
        mut,
        seeds = [legal_registry.key().as_ref(), legal_account.nonce.as_ref()],
        bump,
    )]
    pub legal_account: Box<Account<'info, LegalAccount>>,
}

pub fn handler(ctx: Context<RevokeLegalAccount>, uri: String) -> Result<()> {
    let legal_account = &mut ctx.accounts.legal_account;
    legal_account.uri = uri;
    Ok(())
}
