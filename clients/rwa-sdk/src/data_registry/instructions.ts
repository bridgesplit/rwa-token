import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { CommonArgs, getProvider } from "../utils";
import { getDataProgram, getDataRegistryPda } from "./utils";

export interface CreateDataRegistryArgs extends CommonArgs{
    authority: string;
}

export async function getCreateDataRegistryIx(
    args: CreateDataRegistryArgs,
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const dataProgram = getDataProgram(provider);
    const ix = await dataProgram.methods.createDataRegistry(new PublicKey(args.authority), args.delegate ? new PublicKey(args.delegate) : null)
        .accountsStrict({
            payer: args.payer,
            assetMint: args.assetMint,
            dataRegistry: getDataRegistryPda(args.assetMint),
            systemProgram: SystemProgram.programId
        })
        .instruction();
    return ix;
}