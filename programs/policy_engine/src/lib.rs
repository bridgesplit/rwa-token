pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

pub use error::*;
pub use instructions::*;
pub use state::*;
pub use utils::*;

use anchor_lang::prelude::*;

declare_id!("AyrjGg1gAsWMyiHMjdtN1As4FrVuHmgmUMPGbJC2RFds");

#[program]
pub mod policy_engine {
    use super::*;

    // pub fn evaluate_policies(
    //     ctx
    // ) -> Result<()> {
    //     // instructions::create::handler(ctx, args)
    //     Ok(())
    // }
}
