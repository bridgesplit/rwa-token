use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct RemovePolicy<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = policy_engine.authority == authority.key(),
    )]
    pub policy_engine: Box<Account<'info, PolicyEngineAccount>>,
    #[account(mut)]
    /// CHECK: can be any policy
    pub policy: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl RemovePolicy<'_> {
    pub fn close_policy(&self) -> Result<()> {
        let lamports = self.policy.lamports();
        self.payer.add_lamports(lamports)?;
        self.policy.sub_lamports(lamports)?;
        self.policy.assign(self.system_program.key);
        self.policy.realloc(0, false)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<RemovePolicy>) -> Result<()> {
    ctx.accounts
        .policy_engine
        .remove_policy(ctx.accounts.policy.key())?;

    // close policy account
    ctx.accounts.close_policy()?;
    Ok(())
}
