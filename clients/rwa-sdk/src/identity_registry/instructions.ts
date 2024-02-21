import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { CommonArgs, getProvider } from "../utils";
import { getIdentityAccountPda, getIdentityProgram, getIdentityRegistryPda } from "./utils";

export interface CreateIdentityRegistryArgs extends CommonArgs {
    authority: string;
}

export async function getCreateIdentityRegistryIx(
    args: CreateIdentityRegistryArgs,
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const identityProgram = getIdentityProgram(provider);
    const ix = await identityProgram.methods.createIdentityRegistry(new PublicKey(args.authority), args.delegate ? new PublicKey(args.delegate) : null)
        .accountsStrict({
            payer: args.payer,
            assetMint: args.assetMint,
            identityRegistry: getIdentityRegistryPda(args.assetMint),
            systemProgram: SystemProgram.programId
        })
        .instruction();
    return ix;
}

export interface CreateIdentityAccountArgs extends CommonArgs {
    level: number;
}

export async function getCreateIdentityAccountIx(
    args: CreateIdentityAccountArgs,
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const identityProgram = getIdentityProgram(provider);
    const ix = await identityProgram.methods.createIdentityAccount(new PublicKey(args.owner), args.level)
        .accountsStrict({
            payer: args.payer,
            identityRegistry: getIdentityRegistryPda(args.assetMint),
            identityAccount: getIdentityAccountPda(args.assetMint, args.owner),
            systemProgram: SystemProgram.programId,
            signer: args.signer ? args.signer : getIdentityRegistryPda(args.assetMint),
        })
        .instruction();
    return ix;
}