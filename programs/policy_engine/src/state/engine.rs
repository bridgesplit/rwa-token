use anchor_lang::{prelude::*, AnchorSerialize};

use crate::{PolicyEngineErrors, PolicyType};

#[account()]
#[derive(InitSpace)]
pub struct PolicyEngineAccount {
    /// version
    pub version: u8,
    /// asset mint
    pub asset_mint: Pubkey,
    /// authority of the registry
    pub authority: Pubkey,
    /// policy delegate
    pub delegate: Pubkey,
    /// max timeframe of all the policies
    pub max_timeframe: i64,
}

impl PolicyEngineAccount {
    pub const VERSION: u8 = 1;
    pub fn new(
        &mut self,
        engine: Pubkey,
        authority: Pubkey,
        delegate: Option<Pubkey>,
        asset_mint: Pubkey,
    ) {
        self.version = Self::VERSION;
        self.authority = authority;
        self.delegate = delegate.unwrap_or(engine);
        self.asset_mint = asset_mint;
    }
    pub fn update_delegate(&mut self, delegate: Pubkey) {
        self.delegate = delegate;
    }
    pub fn verify_signer(&self, registry: Pubkey, signer: Pubkey, is_signer: bool) -> Result<()> {
        if signer == registry && self.delegate == registry {
            return Ok(());
        }
        if (signer == self.authority || signer == self.delegate) && is_signer {
            return Ok(());
        }
        Err(PolicyEngineErrors::UnauthorizedSigner.into())
    }
    /// update max timeframe if new value is greater than current
    pub fn update_max_timeframe(&mut self, policy_type: PolicyType) {
        let mut max_timeframe = self.max_timeframe;
        match policy_type {
            PolicyType::TransactionAmountVelocity {
                limit: _,
                timeframe,
            } => {
                if timeframe > max_timeframe {
                    max_timeframe = timeframe;
                }
            }
            PolicyType::TransactionCountVelocity {
                limit: _,
                timeframe,
            } => {
                if timeframe > max_timeframe {
                    max_timeframe = timeframe;
                }
            }
            _ => {}
        }
        self.max_timeframe = max_timeframe;
    }
}
