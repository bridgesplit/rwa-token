pub use anchor_lang::prelude::*;

#[account()]
#[derive(InitSpace)]
pub struct TransactionApprovalAccount {
    /// asset mint
    pub asset_mint: Pubkey,
    /// from token account
    pub from_token_account: Option<Pubkey>,
    /// to token account
    pub to_token_account: Option<Pubkey>,
    /// amount to be transferred
    pub amount: Option<u64>,
    /// slot in which approve account has been generated
    pub slot: u64,
}

impl TransactionApprovalAccount {
    pub const SEED: &'static str = "transaction-approval-account";
    pub fn new(
        &mut self,
        asset_mint: Pubkey,
        slot: u64,
        from_token_account: Option<Pubkey>,
        to_token_account: Option<Pubkey>,
        amount: Option<u64>,
    ) {
        self.asset_mint = asset_mint;
        self.slot = slot;
        self.from_token_account = from_token_account;
        self.to_token_account = to_token_account;
        self.amount = amount;
    }
}
