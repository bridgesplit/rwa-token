import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { DataRegistryIdl } from "../programs/idls";
import { PublicKey } from "@solana/web3.js";
import { DataRegistry } from "../programs/types";

export const DATA_REGISTRY_PROGRAM_ID = new PublicKey("8WRaNVNMDqdwADbKYj7fBd47i2e5SFMSEs8TrA2Vd5io");

export const getDataProgram = (provider: Provider) => {
    return new Program(
        DataRegistryIdl as Idl,
        DATA_REGISTRY_PROGRAM_ID,
        provider
    ) as unknown as Program<DataRegistry>;
}

export const getDataRegistryPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(assetMint).toBuffer()],
        DATA_REGISTRY_PROGRAM_ID
    )[0];
}