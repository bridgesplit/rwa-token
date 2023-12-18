use crate::{get_bump_in_seed_form, state::*};
use anchor_lang::prelude::*;
use asset_controller::{
    cpi::{accounts::GenerateTransactionApproval, generate_transaction_approval},
    program::AssetController,
    AssetControllerData, GenerateTransationApprovalArgs,
};

#[derive(Accounts)]
#[instruction()]
pub struct CheckIdentityAuthorization<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub transaction_approval: UncheckedAccount<'info>,
    #[account(
        seeds = [legal_registry.asset_mint.key().as_ref(), IdentityRegistry::SEED],
        bump,
        constraint = legal_registry.authority == authority.key(),
    )]
    pub legal_registry: Box<Account<'info, IdentityRegistry>>,
    #[account(
        seeds = [legal_registry.key().as_ref(), legal_account.owner.as_ref()],
        bump,
    )]
    pub legal_account: Box<Account<'info, IdentityAccount>>,
    #[account(
        owner = AssetController::id()
    )]
    pub asset_controller_data: Account<'info, AssetControllerData>,
    pub asset_controller: Program<'info, AssetController>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

impl CheckIdentityAuthorization<'_> {
    pub fn generate_transaction_approval_account(
        &self,
        args: GenerateTransationApprovalArgs,
        signer_seeds: &[&[&[u8]]],
    ) -> Result<()> {
        let cpi_accounts = GenerateTransactionApproval {
            payer: self.payer.to_account_info(),
            authority: self.authority.to_account_info(),
            owner: self.owner.to_account_info(),
            asset_controller_data: self.asset_controller_data.to_account_info(),
            transaction_approval_account: self.transaction_approval.to_account_info(),
            system_program: self.system_program.to_account_info(),
            clock: self.clock.to_account_info(),
        };

        let cpi_program = self.legal_registry.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        generate_transaction_approval(cpi_ctx, args)
    }
}

pub fn handler(
    ctx: Context<CheckIdentityAuthorization>,
    args: GenerateTransationApprovalArgs,
) -> Result<()> {
    let registry_signer_seeds: &[&[&[u8]]] = &[
        &[&IdentityRegistry::SEED[..]],
        &[&get_bump_in_seed_form(&ctx.bumps.legal_registry)],
    ];
    ctx.accounts
        .generate_transaction_approval_account(args, registry_signer_seeds)?;
    Ok(())
}
