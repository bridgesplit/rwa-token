use anchor_lang::prelude::*;

#[error_code]
pub enum AssetControllerErrors {
    #[msg("Transfer hasnt been approved for the asset mint")]
    TransferMintNotApproved,
    #[msg("Transfer hasnt been approved for from account")]
    TransferFromNotApproved,
    #[msg("Transfer hasnt been approved for to account")]
    TransferToNotApproved,
    #[msg("Transfer hasnt been approved for the specified amount")]
    TransferAmountNotApproved,
    #[msg("All poliicy accounts must be sent in the instruction")]
    PolicyRegistrysMissing,
    #[msg("Invalid policy account passed")]
    PolicyRegistryMismatch,
}
