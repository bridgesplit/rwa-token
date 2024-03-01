use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(owner: Pubkey)]
pub struct AddLevelToIdentityAccount<'info> {
    #[account()]
    /// CHECK: signer check
    pub signer: UncheckedAccount<'info>,
    #[account(
        constraint = identity_registry.verify_signer(identity_registry.key(), signer.key(), signer.is_signer).is_ok()
    )]
    pub identity_registry: Box<Account<'info, IdentityRegistryAccount>>,
    #[account(
        mut,
        seeds = [identity_registry.key().as_ref(), owner.as_ref()],
        bump,
    )]
    pub identity_account: Box<Account<'info, IdentityAccount>>,
}

pub fn handler(ctx: Context<AddLevelToIdentityAccount>, _owner: Pubkey, level: u8) -> Result<()> {
    ctx.accounts.identity_account.add_level(level)?;
    Ok(())
}
