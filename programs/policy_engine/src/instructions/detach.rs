use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct DetachFromPolicyAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        constraint = policy_engine.authority == signer.key() || policy_engine.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub policy_engine: Box<Account<'info, PolicyEngineAccount>>,
    #[account(
        mut,
        seeds = [policy_engine.key().as_ref()],
        bump,
        realloc = policy_account.to_account_info().data_len() - Policy::INIT_SPACE,
        realloc::zero = false,
        realloc::payer = payer,
    )]
    pub policy_account: Box<Account<'info, PolicyAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<DetachFromPolicyAccount>, hash: String) -> Result<()> {
    let policy_type = ctx.accounts.policy_account.detach(hash)?;
    // update max timeframe if detached policy was the max timeframe

    let mut max_timeframe = match policy_type {
        PolicyType::TransactionAmountVelocity {
            limit: _,
            timeframe,
        } => timeframe,
        PolicyType::TransactionCountVelocity {
            limit: _,
            timeframe,
        } => timeframe,
        _ => 0,
    };

    if max_timeframe == ctx.accounts.policy_engine.max_timeframe {
        max_timeframe = 0;
        for policy in ctx.accounts.policy_account.policies.iter() {
            if let PolicyType::TransactionAmountVelocity {
                limit: _,
                timeframe,
            } = policy.policy_type
            {
                if timeframe > max_timeframe {
                    max_timeframe = timeframe;
                }
            }
            if let PolicyType::TransactionCountVelocity {
                limit: _,
                timeframe,
            } = policy.policy_type
            {
                if timeframe > max_timeframe {
                    max_timeframe = timeframe;
                }
            }
        }
    }
    ctx.accounts.policy_engine.max_timeframe = max_timeframe;
    Ok(())
}
