use anchor_lang::{prelude::*, AnchorSerialize};

use crate::PolicyType;

#[account()]
#[derive(InitSpace, Copy)]
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

pub fn get_policy_engine_pda(asset_mint: Pubkey) -> Pubkey {
    let (pda, _) = Pubkey::find_program_address(&[&asset_mint.to_bytes()], &crate::ID);
    pda
}

impl PolicyEngineAccount {
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, authority: Pubkey, delegate: Option<Pubkey>, asset_mint: Pubkey) {
        self.version = Self::VERSION;
        self.authority = authority;
        self.delegate = delegate.unwrap_or(authority);
        self.asset_mint = asset_mint;
    }
    pub fn update_delegate(&mut self, delegate: Pubkey) {
        self.delegate = delegate;
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

/// bec of circular dependancy acp's pubkey is hardcoded
pub fn get_asset_controller_account_pda(asset_mint: Pubkey) -> Pubkey {
    Pubkey::find_program_address(
        &[asset_mint.as_ref()],
        &pubkey!("acpcFrzEYKjVLvZGWueTV8vyDjhu3oKC7sN38QELLan"),
    )
    .0
}
