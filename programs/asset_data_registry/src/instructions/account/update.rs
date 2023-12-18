use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction()]
pub struct RevokeDataAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [data_registry.asset_mint.key().as_ref(), DataRegistry::SEED],
        bump,
        constraint = data_registry.authority == authority.key(),
    )]
    pub data_registry: Box<Account<'info, DataRegistry>>,
    #[account(
        mut,
        seeds = [data_registry.key().as_ref(), data_account.nonce.as_ref()],
        bump,
    )]
    pub data_account: Box<Account<'info, DataAccount>>,
}

pub fn handler(ctx: Context<RevokeDataAccount>, data: [u8; 1024]) -> Result<()> {
    let data_account = &mut ctx.accounts.data_account;
    data_account.data = data;

    Ok(())
}
