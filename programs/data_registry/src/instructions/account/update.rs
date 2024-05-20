use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateDataAccountArgs {
    pub type_: DataAccountType,
    pub name: String,
    pub uri: String,
}

#[derive(Accounts)]
#[instruction(args: UpdateDataAccountArgs)]
pub struct UpdateDataAccount<'info> {
    #[account(
        constraint = data_registry.authority == signer.key() || data_registry.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account(
        constraint = data_registry.key() == data_account.data_registry
    )]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
    #[account(mut)]
    pub data_account: Box<Account<'info, DataAccount>>,
}

pub fn handler(ctx: Context<UpdateDataAccount>, args: UpdateDataAccountArgs) -> Result<()> {
    ctx.accounts
        .data_account
        .update(args.type_, args.name, args.uri);

    Ok(())
}
