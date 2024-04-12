use anchor_lang::prelude::*;

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
    pub fn new(&mut self, asset_mint: Pubkey, authority: Pubkey, delegate: Option<Pubkey>) {
        self.version = Self::VERSION;
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate.unwrap_or(authority);
    }
    pub fn update_delegate(&mut self, delegate: Pubkey) {
        self.delegate = delegate;
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum DataAccountType {
    Title,
    Legal,
    Tax,
    Miscellaneous,
}

pub const MAX_NAME_LEN: usize = 32;
pub const MAX_URI_LEN: usize = 255;

#[account()]
#[derive(InitSpace)]
pub struct DataAccount {
    pub version: u8,
    /// data registry to which the account belongs
    pub data_registry: Pubkey,
    /// type of the data account
    pub _type: DataAccountType,
    /// used by creator to store name of the document
    #[max_len(MAX_NAME_LEN)]
    pub name: String,
    /// uri pointing to the data stored in the document
    #[max_len(MAX_URI_LEN)]
    pub uri: String,
}

impl DataAccount {
    pub const VERSION: u8 = 1;
    pub fn new(
        &mut self,
        data_registry: Pubkey,
        _type: DataAccountType,
        name: String,
        uri: String,
    ) {
        self.version = Self::VERSION;
        self.data_registry = data_registry;
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
