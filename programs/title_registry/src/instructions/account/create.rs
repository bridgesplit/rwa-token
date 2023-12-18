use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateTitleAccountArgs {
    pub nonce: Pubkey,
    pub uri: String,
}

#[derive(Accounts)]
#[instruction(args: CreateTitleAccountArgs)]
pub struct CreateTitleAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [title_registry.asset_mint.key().as_ref(), TitleRegistry::SEED],
        bump,
        constraint = title_registry.authority == authority.key(),
    )]
    pub title_registry: Box<Account<'info, TitleRegistry>>,
    #[account(
        init,
        space = TitleAccount::LEN,
        seeds = [title_registry.key().as_ref(), args.nonce.as_ref()],
        bump,
        payer = payer,
    )]
    pub title_account: Box<Account<'info, TitleAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateTitleAccount>, args: CreateTitleAccountArgs) -> Result<()> {
    let title_account = &mut ctx.accounts.title_account;
    title_account.version = TitleAccount::CURRENT_VERSION;
    title_account.nonce = args.nonce;
    title_account.uri = args.uri;
    title_account.status = TitleAccountStatus::default();
    title_account.title_registry = ctx.accounts.title_registry.key();

    Ok(())
}
