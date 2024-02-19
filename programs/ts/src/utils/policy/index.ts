import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { PolicyEngineIdl } from "../../programs/idls";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { PolicyEngine } from "../../programs/types";
import { getProvider } from "..";

export const POLICY_REGISTRY_PROGRAM_ID = new PublicKey("6FcM5R2KcdUGcdLunzLm3XLRFr7FiF6Hdz3EWni8YPa2");

export const getPolicyProgram = (provider: Provider) => {
    return new Program(
        PolicyEngineIdl as Idl,
        POLICY_REGISTRY_PROGRAM_ID,
        provider
    ) as unknown as Program<PolicyEngine>;
}

export const getPolicyEnginePda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(assetMint).toBuffer()],
        POLICY_REGISTRY_PROGRAM_ID
    )[0];
}
export async function getCreatePolicyEngineIx(
    payer: string,
    authority: string,
    delegate: string,
    assetMint: string,
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const policyProgram = getPolicyProgram(provider);
    const ix = await policyProgram.methods.createPolicyEngine(new PublicKey(authority), new PublicKey(delegate))
        .accountsStrict({
            payer,
            assetMint,
            policyEngine: getPolicyEnginePda(assetMint),
            systemProgram: SystemProgram.programId,
        })
        .instruction();
    return ix;
}

export * from "./attach";