import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { CommonArgs, getProvider, ixReturn } from "../utils";
import { getPolicyEnginePda, getPolicyProgram } from "./utils";
import { IdentityFilter, Policy } from "./types";

export interface CreatePolicyEngineArgs extends CommonArgs {
    authority: string;
}

export async function getCreatePolicyEngineIx(
    args: CreatePolicyEngineArgs
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const policyProgram = getPolicyProgram(provider);
    const ix = await policyProgram.methods.createPolicyEngine(new PublicKey(args.authority), args.delegate ? new PublicKey(args.delegate) : null)
        .accountsStrict({
            payer: args.payer,
            assetMint: args.assetMint,
            policyEngine: getPolicyEnginePda(args.assetMint),
            systemProgram: SystemProgram.programId,
        })
        .instruction();
    return ix;
}
export interface AttachPolicyArgs {
    authority: string;
    owner: string;
    assetMint: string;
    payer: string;
    identityFilter: IdentityFilter;
    policy: Policy;
}

export function padIdentityLevels(levels: number[]): number[] {
    const maxLevels = 10;
    return levels.concat(new Array(maxLevels - levels.length).fill(0));
}

export async function getAttachPolicyAccountIx(
    args: AttachPolicyArgs,
): Promise<ixReturn> {
    const provider = getProvider();
    const policyProgram = getPolicyProgram(provider);
    const policyAccount = new Keypair();
    const ix = await policyProgram.methods.attachPolicyAccount(
        args.identityFilter,
        args.policy,
    )
        .accountsStrict({
            policyAccount: policyAccount.publicKey,
            signer: new PublicKey(args.authority),
            payer: args.payer,
            policyEngine: getPolicyEnginePda(args.assetMint),
            systemProgram: SystemProgram.programId,
        })
        .instruction();
    return {
        ixs: [ix],
        signers: [policyAccount],
    }
}