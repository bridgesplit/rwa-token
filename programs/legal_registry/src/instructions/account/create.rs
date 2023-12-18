use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateLegalAccountArgs {
    pub nonce: Pubkey,
    pub uri: String,
}

#[derive(Accounts)]
#[instruction(args: CreateLegalAccountArgs)]
pub struct CreateLegalAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [legal_registry.asset_mint.key().as_ref(), LegalRegistry::SEED],
        bump,
        constraint = legal_registry.authority == authority.key(),
    )]
    pub legal_registry: Box<Account<'info, LegalRegistry>>,
    #[account(
        init,
        space = LegalAccount::LEN,
        seeds = [legal_registry.key().as_ref(), args.nonce.as_ref()],
        bump,
        payer = payer,
    )]
    pub legal_account: Box<Account<'info, LegalAccount>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateLegalAccount>, args: CreateLegalAccountArgs) -> Result<()> {
    let legal_account = &mut ctx.accounts.legal_account;
    legal_account.version = LegalAccount::CURRENT_VERSION;
    legal_account.nonce = args.nonce;
    legal_account.uri = args.uri;
    legal_account.legal_registry = ctx.accounts.legal_registry.key();

    Ok(())
}
