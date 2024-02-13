use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct RemovePolicyAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = policy_registry.authority == authority.key(),
    )]
    pub policy_registry: Box<Account<'info, PolicyRegistry>>,
    #[account(mut)]
    /// CHECK: can be any policy account
    pub policy_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl RemovePolicyAccount<'_> {
    pub fn close_policy_account(&self) -> Result<()> {
        let lamports = self.policy_account.lamports();
        self.payer.add_lamports(lamports)?;
        self.policy_account.sub_lamports(lamports)?;
        self.policy_account.assign(self.system_program.key);
        self.policy_account.realloc(0, false)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<RemovePolicyAccount>) -> Result<()> {
    ctx.accounts
        .policy_registry
        .remove_policy(ctx.accounts.policy_account.key())?;

    // close policy account
    ctx.accounts.close_policy_account()?;
    Ok(())
}
