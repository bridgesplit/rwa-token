use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CreatePolicyEngine<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mint::token_program = TOKEN22
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = 8 + PolicyEngineAccount::INIT_SPACE,
        seeds = [asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub policy_engine: Box<Account<'info, PolicyEngineAccount>>,
    pub system_program: Program<'info, System>,
}

/// Creates a new policy engine with a specific authority and delegate.
/// Authority is responsible for the policy engine.
/// Delegate is an optional public key responsible for the policy engine.
/// Returns a `Result` indicating success or failure.
pub fn handler(
    ctx: Context<CreatePolicyEngine>,
    authority: Pubkey,
    delegate: Option<Pubkey>,
) -> Result<()> {
    let registry_address = ctx.accounts.policy_engine.key();
    ctx.accounts.policy_engine.new(
        registry_address,
        authority,
        delegate,
        ctx.accounts.asset_mint.key(),
    );

    Ok(())
}
