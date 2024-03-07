use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey)]
pub struct CreateIdentityAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: signer check
    pub signer: UncheckedAccount<'info>,
    #[account(
        constraint = identity_registry.verify_signer(identity_registry.key(), signer.key(), signer.is_signer).is_ok()
    )]
    pub identity_registry: Box<Account<'info, IdentityRegistryAccount>>,
    #[account(
        init,
        space = 8 + IdentityAccount::INIT_SPACE,
        seeds = [identity_registry.key().as_ref(), owner.as_ref()],
        bump,
        payer = payer,
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateIdentityAccount>, owner: Pubkey, level: u8) -> Result<()> {
    ctx.accounts
        .identity_account
        .new(owner, ctx.accounts.identity_registry.asset_mint, level);
    Ok(())
}
