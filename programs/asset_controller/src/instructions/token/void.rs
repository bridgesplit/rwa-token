use anchor_lang::prelude::*;
use anchor_spl::token_interface::{burn, Burn, Mint, Token2022, TokenAccount};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct VoidTokens<'info> {
    #[account()]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = asset_mint,
        associated_token::authority = owner,
    )]
    pub token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub token_program: Program<'info, Token2022>,
}

/// This handler this function orchestrates the burning of tokens
/// by setting up the required accounts, calling the burn instruction through CPI,
/// and handling any errors that may occur during the process.
/// Effectivley 'voiding' shares of RWA asset.

pub fn handler(ctx: Context<VoidTokens>, amount: u64) -> Result<()> {
    //Prepares accounts for burn via CPI
    let accounts = Burn {
        mint: ctx.accounts.asset_mint.to_account_info(),
        from: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
    burn(cpi_ctx, amount)?;
    Ok(())
}
