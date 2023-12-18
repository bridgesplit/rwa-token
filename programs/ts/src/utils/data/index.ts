import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { DataRegistryIdl } from "../../programs/idls";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { DataRegistry } from "../../programs/types";
import { getProvider } from "..";

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

export async function getCreateDataRegistryIx(
    payer: string,
    authority: string,
    delegate: string,
    assetMint: string,
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const dataProgram = getDataProgram(provider);
    const ix = await dataProgram.methods.createDataRegistry(new PublicKey(authority), new PublicKey(delegate))
        .accountsStrict({
            payer,
            assetMint,
            dataRegistry: getDataRegistryPda(assetMint),
            systemProgram: SystemProgram.programId
        })
        .instruction();
    return ix;
}