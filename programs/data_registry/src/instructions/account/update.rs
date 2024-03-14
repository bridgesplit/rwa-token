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
    #[account()]
    /// CHECK: can be either authority or delegate
    pub signer: UncheckedAccount<'info>,
    #[account(
        constraint = data_registry.verify_signer(data_registry.key(), signer.key(), signer.is_signer).is_ok()
    )]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
    #[account(mut)]
    pub data_account: Box<Account<'info, DataAccount>>,
}

/// Writes args to data registry. Updates type, name, uri.
pub fn handler(ctx: Context<UpdateDataAccount>, args: UpdateDataAccountArgs) -> Result<()> {
    ctx.accounts
        .data_account
        .update(args.type_, args.name, args.uri);

    Ok(())
}
