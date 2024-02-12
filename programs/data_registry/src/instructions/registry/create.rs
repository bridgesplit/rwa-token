use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateDataRegistryArgs {
    pub authority: Pubkey,
    pub delegate: Pubkey,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateDataRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = DataRegistry::LEN,
        seeds = [asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub data_registry: Box<Account<'info, DataRegistry>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateDataRegistry>, args: CreateDataRegistryArgs) -> Result<()> {
    ctx.accounts
        .data_registry
        .new(ctx.accounts.asset_mint.key(), args.authority, args.delegate);
    Ok(())
}
