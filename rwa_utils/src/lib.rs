pub mod constants;
pub mod geyser;

pub use constants::*;
pub use geyser::*;

pub fn get_bump_in_seed_form(bump: &u8) -> [u8; 1] {
    let bump_val = *bump;
    [bump_val]
}
