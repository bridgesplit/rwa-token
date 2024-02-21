use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    transfer_checked, Mint, Token2022, TokenAccount, TransferChecked,
};
use identity_registry::IdentityAccount;
use policy_engine::{deserialize_and_enforce_policy, PolicyEngine};

use crate::{state::*, AssetControllerErrors};

#[derive(Accounts)]
#[instruction(amount: u64, to: Pubkey)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: constraint checks
    pub signer: UncheckedAccount<'info>,
    #[account()]
    pub from: Signer<'info>,
    #[account(
        constraint = amount != 0,
        mint::token_program = TOKEN22
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init_if_needed,
        payer = payer,
        space = TransactionApprovalAccount::LEN,
        seeds = [TransactionApprovalAccount::SEED.as_ref(), asset_mint.key().as_ref()],
        bump,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    #[account(
        mut,
        seeds = [asset_mint.key().as_ref(), from.key().as_ref()],
        bump,
    )]
    pub tracker_account: Account<'info, TrackerAccount>,
    #[account(
        mut,
        token::mint = asset_mint,
        token::authority = from,
        token::token_program = TOKEN22
    )]
    pub from_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        mut,
        token::mint = asset_mint,
        token::authority = to,
        token::token_program = TOKEN22
    )]
    pub to_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        owner = policy_engine::id(),
    )]
    pub policy_engine: Account<'info, PolicyEngine>,
    #[account(
        owner = identity_registry::id(),
    )]
    pub identity_account: Account<'info, IdentityAccount>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub const TRANSFER_REMAINING_ACCOUNTS_LEN: usize = 2;

impl<'info> TransferTokens<'info> {
    pub fn transfer_checked(
        &self,
        remaining_accounts: Vec<AccountInfo<'info>>,
        amount: u64,
        decimals: u8,
    ) -> Result<()> {
        let cpi_accounts = TransferChecked {
            from: self.from_token_account.to_account_info(),
            to: self.to_token_account.to_account_info(),
            authority: self.from.to_account_info(),
            mint: self.asset_mint.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
            .with_remaining_accounts(remaining_accounts);
        transfer_checked(cpi_ctx, amount, decimals)?;
        Ok(())
    }
}

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, TransferTokens<'info>>,
    amount: u64,
    _to: Pubkey,
) -> Result<()> {
    ctx.accounts.transaction_approval_account.new(
        ctx.accounts.asset_mint.key(),
        Clock::get()?.slot,
        Some(ctx.accounts.from_token_account.key()),
        Some(ctx.accounts.to_token_account.key()),
        Some(amount),
    );

    let remaining_accounts = ctx.remaining_accounts.to_vec();
    let policies = ctx
        .accounts
        .policy_engine
        .policies
        .iter()
        .filter(|x| x != &&Pubkey::default())
        .collect::<Vec<_>>();
    let transfer_amounts = ctx.accounts.tracker_account.transfer_amounts;
    let transfer_timestamps = ctx.accounts.tracker_account.transfer_timestamps;
    if remaining_accounts.len() < policies.len() + TRANSFER_REMAINING_ACCOUNTS_LEN {
        return Err(AssetControllerErrors::PolicyAccountsMissing.into());
    }
    for (i, policy) in policies[..].iter().enumerate() {
        let tracker_account = &remaining_accounts[i + TRANSFER_REMAINING_ACCOUNTS_LEN];
        if tracker_account.key != *policy {
            return Err(AssetControllerErrors::InvalidPolicyAccount.into());
        }
        // evaluate policy
        deserialize_and_enforce_policy(
            &tracker_account.data.borrow(),
            amount,
            Clock::get()?.unix_timestamp,
            ctx.accounts.identity_account.levels,
            transfer_amounts,
            transfer_timestamps,
        )?;
    }

    // transfer tokens
    ctx.accounts.transfer_checked(
        ctx.remaining_accounts[..TRANSFER_REMAINING_ACCOUNTS_LEN].to_vec(),
        amount,
        ctx.accounts.asset_mint.decimals,
    )?;

    let timestamp = Clock::get()?.unix_timestamp;
    let max_timeframe = ctx.accounts.policy_engine.max_timeframe;
    ctx.accounts
        .tracker_account
        .update_transfer_history(amount, timestamp, max_timeframe)?;

    // close approval account
    ctx.accounts
        .transaction_approval_account
        .close(ctx.accounts.payer.to_account_info())?;
    Ok(())
}
