use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateDataAccountArgs {
    pub type_: DataAccountType,
    pub name: String,
    pub uri: String,
}

#[derive(Accounts)]
#[instruction(args: CreateDataAccountArgs)]
pub struct CreateDataAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [data_registry.asset_mint.key().as_ref()],
        bump,
        constraint = data_registry.authority == authority.key(),
    )]
    pub data_registry: Box<Account<'info, DataRegistry>>,
    #[account(
        init,
        signer,
        space = DataAccount::LEN,
        payer = payer,
    )]
    pub data_account: Box<Account<'info, DataAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateDataAccount>, args: CreateDataAccountArgs) -> Result<()> {
    ctx.accounts.data_account.new(
        ctx.accounts.data_registry.key(),
        args.type_,
        args.name,
        args.uri,
    );

    Ok(())
}
