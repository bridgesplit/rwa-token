use anchor_lang::{prelude::*, AnchorSerialize};

use crate::PolicyEngineErrors;

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
    /// list of all policies
    pub policies: [Pubkey; 10],
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
    /// add policy if there is space
    pub fn add_policy(&mut self, policy: Pubkey) -> Result<()> {
        for i in 0..self.policies.len() {
            if self.policies[i] == Pubkey::default() {
                self.policies[i] = policy;
                return Ok(());
            }
        }
        Err(PolicyEngineErrors::PolicyEngineFull.into())
    }
    /// update max timeframe if new value is greater than current
    pub fn update_max_timeframe(&mut self, max_timeframe: i64) {
        if max_timeframe > self.max_timeframe {
            self.max_timeframe = max_timeframe;
        }
    }
    /// remove policy if found, rearrange array to push all non-default keys to the end
    pub fn remove_policy(&mut self, policy: Pubkey) -> Result<()> {
        let mut found = false;
        for i in 0..self.policies.len() {
            if self.policies[i] == policy {
                self.policies[i] = Pubkey::default();
                found = true;
            }
        }
        if found {
            let mut j = 0;
            for i in 0..self.policies.len() {
                if self.policies[i] != Pubkey::default() {
                    self.policies.swap(i, j);
                    j += 1;
                }
            }
            Ok(())
        } else {
            Err(PolicyEngineErrors::PolicyNotFound.into())
        }
    }
}
