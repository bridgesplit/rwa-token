use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CreatePolicyRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: can be any account
    #[account()]
    pub owner: UncheckedAccount<'info>,
    #[account(
        mint::token_program = TOKEN22
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = PolicyRegistry::LEN,
        seeds = [asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub policy_registry: Box<Account<'info, PolicyRegistry>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreatePolicyRegistry>) -> Result<()> {
    ctx.accounts
        .policy_registry
        .new(ctx.accounts.asset_mint.key());

    Ok(())
}
