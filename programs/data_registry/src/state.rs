use anchor_lang::prelude::*;

#[account()]
pub struct DataRegistry {
    pub version: u8,
    pub asset_mint: Pubkey,
    /// can sign creation of new data accounts
    /// can update delegate
    /// can update data account authority
    pub authority: Pubkey,
    /// can sign creation of new data accounts, can be used if a different org needs to issue data accounts
    pub delegate: Pubkey,
}

impl DataRegistry {
    pub const LEN: usize = 8 + 1 + 32 + 32;
    pub const VERSION: u8 = 1;
    pub fn new(&mut self, asset_mint: Pubkey, authority: Pubkey, delegate: Pubkey) {
        self.version = Self::VERSION;
        self.asset_mint = asset_mint;
        self.authority = authority;
        self.delegate = delegate;
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum DataAccountType {
    Title,
    Legal,
    Tax,
    Miscellaneous,
}

#[account()]
pub struct DataAccount {
    pub version: u8,
    /// authority that can update a data account
    pub authority: Pubkey,
    /// registry to which data account belongs to
    pub data_registry: Pubkey,
    /// type of the data account
    pub _type: DataAccountType,
    /// used by creator to store name of the document
    pub name: String,
    /// uri pointing to the data stored in the document
    pub uri: String,
}

impl DataAccount {
    pub const LEN: usize = 8 + 32 + 255;
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
}
