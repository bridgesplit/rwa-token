import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { IdentityFilter } from ".";
import { getPolicyProgram, getPolicyEnginePda, getProvider, ixReturn } from "../..";

export interface AttachIdentityApprovalArgs {
    authority: string;
    owner: string;
    assetMint: string;
    payer: string;
    identityFilter: IdentityFilter;
}

export async function getAttachIdentityApprovalIx(
    args: AttachIdentityApprovalArgs,
): Promise<ixReturn> {
    const provider = getProvider();
    const policyProgram = getPolicyProgram(provider);
    const policy = new Keypair();
    const ix = await policyProgram.methods.attachIdentityApproval({
        identityLevels: Buffer.from(args.identityFilter.identityLevels),
        comparisionType: args.identityFilter.comparisionType,
    })
        .accountsStrict({
            policy: policy.publicKey,
            authority: new PublicKey(args.authority),
            payer: args.payer,
            policyEngine: getPolicyEnginePda(args.assetMint),
            systemProgram: SystemProgram.programId,
        })
        .instruction();
    return {
        ixs: [ix],
        signers: [policy],
    }
}