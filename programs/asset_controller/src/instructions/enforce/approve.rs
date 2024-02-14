use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;
use identity_registry::{get_identity_registry_pda, IdentityAccount};
use policy_registry::{deserialize_and_enforce_policy, PolicyAccount, PolicyRegistry};

use crate::{state::*, AssetControllerErrors};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct GenerateTransactionApprovalArgs {
    pub owner: Pubkey,
    pub amount: Option<u64>,
    pub from: Option<Pubkey>,
    pub to: Option<Pubkey>,
}

#[derive(Accounts)]
#[instruction(args: GenerateTransactionApprovalArgs)]
pub struct GenerateTransactionApproval<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: checks inside the ix
    pub delegate: UncheckedAccount<'info>,
    #[account(
        mint::token_program = TOKEN22
    )]
    pub asset_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        signer,
        space = TransactionApprovalAccount::LEN,
        payer = payer,
    )]
    pub transaction_approval_account: Box<Account<'info, TransactionApprovalAccount>>,
    #[account(
        seeds = [asset_mint.key().as_ref()],
        bump,
        owner = policy_registry::id(),
    )]
    pub policy_registry: Account<'info, PolicyRegistry>,
    #[account(
        mut,
        seeds = [policy_registry.key().as_ref(), args.owner.as_ref()],
        bump,
        owner = policy_registry::id(),
    )]
    pub policy_account: Account<'info, PolicyAccount>,
    #[account(
        mut,
        seeds = [get_identity_registry_pda(asset_mint.key()).as_ref(), args.owner.as_ref()],
        bump,
        owner = identity_registry::id(),
    )]
    pub identity_account: Account<'info, IdentityAccount>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<GenerateTransactionApproval>,
    args: GenerateTransactionApprovalArgs,
) -> Result<()> {
    ctx.accounts.transaction_approval_account.new(
        ctx.accounts.asset_mint.key(),
        Clock::get()?.slot,
        args.from,
        args.to,
        args.amount,
    );
    let remaining_accounts = ctx.remaining_accounts.to_vec();
    let policies = ctx.accounts.policy_registry.policies;
    let mut transfer_amounts = ctx.accounts.policy_account.transfer_amounts;
    let mut transfer_timestamps = ctx.accounts.policy_account.transfer_timestamps;

    if let Some(amount) = args.amount {
        if remaining_accounts.len() < policies.len() {
            return Err(AssetControllerErrors::PolicyRegistrysMissing.into());
        }

        for (i, policy) in policies.iter().enumerate() {
            let policy_account = &remaining_accounts[i];
            if policy_account.key != policy {
                return Err(AssetControllerErrors::PolicyRegistryMismatch.into());
            } else {
                // evaluate policy
                deserialize_and_enforce_policy(
                    &policy_account.data.borrow(),
                    amount,
                    Clock::get()?.unix_timestamp,
                    ctx.accounts.identity_account.levels,
                    ctx.accounts.policy_registry.max_timeframe,
                    &mut transfer_amounts,
                    &mut transfer_timestamps,
                )?;
            }
        }
    }
    ctx.accounts.policy_account.transfer_amounts = transfer_amounts;
    ctx.accounts.policy_account.transfer_timestamps = transfer_timestamps;
    Ok(())
}
