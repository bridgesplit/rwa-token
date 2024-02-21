import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { IdentityRegistryIdl } from "../programs/idls";
import { PublicKey } from "@solana/web3.js";
import { IdentityRegistry } from "../programs/types";

export const IDENTITY_REGISTRY_PROGRAM_ID = new PublicKey("qDnvwpjBYjH1vs1N1CSdbVkEkePp2acL7TphAYZDeoV");

export const getIdentityProgram = (provider: Provider) => {
    return new Program(
        IdentityRegistryIdl as Idl,
        IDENTITY_REGISTRY_PROGRAM_ID,
        provider
    ) as unknown as Program<IdentityRegistry>;
}

export const getIdentityRegistryPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(assetMint).toBuffer()],
        IDENTITY_REGISTRY_PROGRAM_ID
    )[0];
}

export const getIdentityAccountPda = (assetMint: string, owner: string) => {
    return PublicKey.findProgramAddressSync(
        [getIdentityRegistryPda(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
        IDENTITY_REGISTRY_PROGRAM_ID
    )[0];
}
