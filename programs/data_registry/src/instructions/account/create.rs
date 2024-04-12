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
    #[account(
        constraint = data_registry.authority == signer.key() || data_registry.delegate == signer.key()
    )]
    pub signer: Signer<'info>,
    #[account()]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
    #[account(
        init,
        signer,
        space = 8 + DataAccount::INIT_SPACE,
        payer = payer,
        constraint = args.name.len() <= MAX_NAME_LEN,
        constraint = args.uri.len() <= MAX_URI_LEN,
    )]
    pub data_account: Box<Account<'info, DataAccount>>,
    pub system_program: Program<'info, System>,
}


/// Initializes a data registry account in the data registry.
pub fn handler(ctx: Context<CreateDataAccount>, args: CreateDataAccountArgs) -> Result<()> {
    ctx.accounts.data_account.new(
        ctx.accounts.data_registry.key(),
        args.type_,
        args.name,
        args.uri,
    );

    Ok(())
}
