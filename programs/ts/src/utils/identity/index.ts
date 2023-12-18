import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { IdentityRegistryIdl } from "../../programs/idls";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { IdentityRegistry } from "../../programs/types";
import { getProvider } from "..";

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

export async function getCreateIdentityRegistryIx(
    payer: string,
    authority: string,
    delegate: string,
    assetMint: string,
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const identityProgram = getIdentityProgram(provider);
    const ix = await identityProgram.methods.createIdentityRegistry(new PublicKey(authority), new PublicKey(delegate))
        .accountsStrict({
            payer,
            assetMint,
            identityRegistry: getIdentityRegistryPda(assetMint),
            systemProgram: SystemProgram.programId
        })
        .instruction();
    return ix;
}

export interface CreateIdentityAccountArgs {
    payer: string;
    signer: string;
    assetMint: string;
    owner: string;
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
            signer: args.signer,
        })
        .instruction();
    return ix;
}