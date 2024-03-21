use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey, level: u8)]
pub struct AddLevelToIdentityAccount<'info> {
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
        mut,
        seeds = [identity_registry.key().as_ref(), identity_account.owner.as_ref()],
        bump,
        realloc = identity_account.to_account_info().data_len() + 1, // u8
        realloc::zero = false,
        realloc::payer = payer,
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddLevelToIdentityAccount>, level: u8) -> Result<()> {
    ctx.accounts.identity_account.add_level(level)?;
    Ok(())
}
