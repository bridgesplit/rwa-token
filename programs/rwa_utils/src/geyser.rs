use anchor_lang::solana_program::program_error::ProgramError;

pub trait GeyserProgramAccount {
    fn discriminator(&self) -> [u8; 8];
    fn deserialize(data: &[u8]) -> Result<Self, ProgramError>
    where
        Self: Sized;
}
