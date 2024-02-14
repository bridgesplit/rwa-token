pub use anchor_lang::prelude::*;

#[account()]
pub struct TransactionApprovalAccount {
    /// asset mint
    pub asset_mint: Pubkey,
    /// slot in which approve account has been generated
    pub slot: u64,
    /// from token account
    pub from: Option<Pubkey>,
    /// to token account
    pub to: Option<Pubkey>,
    /// amount to be transferred
    pub amount: Option<u64>,
}

impl TransactionApprovalAccount {
    pub const LEN: usize = 8 + 32 + 8 + 33 + 33 + 9;
    pub fn new(
        &mut self,
        asset_mint: Pubkey,
        slot: u64,
        from: Option<Pubkey>,
        to: Option<Pubkey>,
        amount: Option<u64>,
    ) {
        self.asset_mint = asset_mint;
        self.slot = slot;
        self.from = from;
        self.to = to;
        self.amount = amount;
    }
}
