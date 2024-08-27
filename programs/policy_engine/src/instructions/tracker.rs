use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::TrackerAccount;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateTokenAccountArgs {
    pub memo_transfer: bool,
}

#[derive(Accounts)]
#[instruction()]
#[event_cpi]
pub struct CreateTrackerAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    /// CHECK: can be any account
    pub owner: UncheckedAccount<'info>,
    #[account()]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = 8 + TrackerAccount::INIT_SPACE,
        seeds = [asset_mint.key().as_ref(), owner.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub tracker_account: Box<Account<'info, TrackerAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateTrackerAccount>) -> Result<()> {
    ctx.accounts
        .tracker_account
        .new(ctx.accounts.asset_mint.key(), ctx.accounts.owner.key());

    Ok(())
}
