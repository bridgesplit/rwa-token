use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct UpdatePolicyEngineDelegate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mint::token_program = TOKEN22
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = PolicyEngine::LEN,
        seeds = [asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub policy_engine: Box<Account<'info, PolicyEngine>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<UpdatePolicyEngineDelegate>, delegate: Pubkey) -> Result<()> {
    ctx.accounts.policy_engine.update_delegate(delegate);

    Ok(())
}
