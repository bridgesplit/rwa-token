use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct CreateIdentityRegistry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account()]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        space = 8 + IdentityRegistryAccount::INIT_SPACE,
        seeds = [asset_mint.key().as_ref()],
        bump,
        payer = payer,
    )]
    pub identity_registry_account: Box<Account<'info, IdentityRegistryAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateIdentityRegistry>,
    authority: Pubkey,
    delegate: Option<Pubkey>,
) -> Result<()> {
    let registry_address = ctx.accounts.identity_registry_account.key();
    ctx.accounts.identity_registry_account.new(
        registry_address,
        ctx.accounts.asset_mint.key(),
        authority,
        delegate,
    );
    Ok(())
}
