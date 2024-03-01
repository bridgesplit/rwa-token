use anchor_lang::prelude::*;

use crate::DataRegistryErrors;

#[account()]
#[derive(InitSpace)]
pub struct DataRegistryAccount {
    pub version: u8,
    pub asset_mint: Pubkey,
    /// can sign creation of new data accounts
    /// can update delegate
    /// can update data account authority
    pub authority: Pubkey,
    /// can sign creation of new data accounts, can be used if a different org needs to issue data accounts
    pub delegate: Pubkey,
}

impl DataRegistryAccount {
    pub const VERSION: u8 = 1;
    pub fn new(
        &mut self,
        address: Pubkey,
        asset_mint: Pubkey,
        authority: Pubkey,
        delegate: Option<Pubkey>,
    ) {
        self.version = Self::VERSION;
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate.unwrap_or_else(|| address);
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
        Err(DataRegistryErrors::UnauthorizedSigner.into())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum DataAccountType {
    Title,
    Legal,
    Tax,
    Miscellaneous,
}

#[account()]
#[derive(InitSpace)]
pub struct DataAccount {
    pub version: u8,
    /// registry to which data account belongs to
    pub data_registry: Pubkey,
    /// type of the data account
    pub _type: DataAccountType,
    /// used by creator to store name of the document
    #[max_len(32)]
    pub name: String,
    /// uri pointing to the data stored in the document
    #[max_len(255)]
    pub uri: String,
}

impl DataAccount {
    pub const VERSION: u8 = 1;
    pub fn new(
        &mut self,
        data_regsitry: Pubkey,
        _type: DataAccountType,
        name: String,
        uri: String,
    ) {
        self.version = Self::VERSION;
        self.data_registry = data_regsitry;
        self._type = _type;
        self.name = name;
        self.uri = uri;
    }
    pub fn update(&mut self, _type: DataAccountType, name: String, uri: String) {
        self._type = _type;
        self.name = name;
        self.uri = uri;
    }
}
