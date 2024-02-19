use crate::{state::*, DataRegistryErrors};
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
        seeds = [data_registry.asset_mint.key().as_ref()],
        bump,
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
    // confirm signer is either authority or signer
    ctx.accounts
        .data_registry
        .check_authority(ctx.accounts.signer.key())?;
    if ctx.accounts.signer.key() == ctx.accounts.data_registry.key() {
        // signer not required
    } else {
        if !ctx.accounts.signer.is_signer {
            return Err(DataRegistryErrors::UnauthorizedSigner.into());
        }
    }
    ctx.accounts.data_account.new(
        ctx.accounts.data_registry.key(),
        args.type_,
        args.name,
        args.uri,
    );

    Ok(())
}
