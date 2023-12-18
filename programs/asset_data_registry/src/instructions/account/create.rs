use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateDataAccountArgs {
    pub nonce: Pubkey,
    pub data: [u8; 1024],
}

#[derive(Accounts)]
#[instruction(args: CreateDataAccountArgs)]
pub struct CreateDataAccount<'info> {
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
        init,
        space = DataAccount::LEN,
        seeds = [data_registry.key().as_ref(), args.nonce.as_ref()],
        bump,
        payer = payer,
    )]
    pub data_account: Box<Account<'info, DataAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateDataAccount>, args: CreateDataAccountArgs) -> Result<()> {
    let data_account = &mut ctx.accounts.data_account;
    data_account.version = DataAccount::CURRENT_VERSION;
    data_account.data_registry = ctx.accounts.data_registry.key();
    data_account.data = args.data;
    data_account.nonce = args.nonce;

    Ok(())
}
