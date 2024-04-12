use anchor_lang::{prelude::*, solana_program::program_option::COption};
use anchor_spl::token_interface::{mint_to, Mint, MintTo, Token2022, TokenAccount};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct IssueTokensArgs {
    pub amount: u64,
    pub to: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: IssueTokensArgs)]
pub struct IssueTokens<'info> {
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = asset_mint.mint_authority == COption::Some(authority.key()),
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        associated_token::token_program = token_program,
        associated_token::mint = asset_mint,
        associated_token::authority = args.to,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub token_program: Program<'info, Token2022>,
}

pub fn handler(ctx: Context<IssueTokens>, args: IssueTokensArgs) -> Result<()> {
    let accounts = MintTo {
        mint: ctx.accounts.asset_mint.to_account_info(),
        to: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
    mint_to(cpi_ctx, args.amount)?;
    Ok(())
}
