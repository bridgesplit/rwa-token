use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey)]
pub struct ApproveIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [legal_registry.asset_mint.key().as_ref(), IdentityRegistry::SEED],
        bump,
        constraint = legal_registry.authority == authority.key(),
    )]
    pub legal_registry: Box<Account<'info, IdentityRegistry>>,
    #[account(
        init,
        space = IdentityAccount::LEN,
        seeds = [legal_registry.key().as_ref(), owner.as_ref()],
        bump,
        payer = payer,
    )]
    pub legal_account: Box<Account<'info, IdentityAccount>>,
    pub system_program: Program<'info, System>,
}
