use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct CreateDataRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = DataRegistry::LEN,
        seeds = [asset_mint.key().as_ref(), DataRegistry::SEED],
        bump,
        payer = payer,
    )]
    pub data_registry: Box<Account<'info, DataRegistry>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateDataRegistry>) -> Result<()> {
    let data_registry = &mut ctx.accounts.data_registry;
    data_registry.version = DataRegistry::CURRENT_VERSION;
    data_registry.asset_mint = ctx.accounts.asset_mint.key();
    data_registry.authority = ctx.accounts.authority.key();
    data_registry.delegate = ctx.accounts.authority.key();
    Ok(())
}
