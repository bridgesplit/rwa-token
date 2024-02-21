import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { CommonArgs, getProvider } from "../utils";
import { getPolicyEnginePda, getPolicyProgram } from "./utils";

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