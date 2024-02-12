use spl_tlv_account_resolution::state::ExtraAccountMetaList;

pub fn get_meta_list_size() -> usize {
    ExtraAccountMetaList::size_of(1).unwrap()
}
