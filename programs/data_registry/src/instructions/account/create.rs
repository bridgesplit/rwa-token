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
    #[account()]
    /// CHECK: can be either authority or delegate
    pub signer: UncheckedAccount<'info>,
    #[account(
        constraint = data_registry.verify_signer(data_registry.key(), signer.key(), signer.is_signer).is_ok()
    )]
    pub data_registry: Box<Account<'info, DataRegistryAccount>>,
    #[account(
        init,
        signer,
        space = 8 + DataAccount::INIT_SPACE,
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
