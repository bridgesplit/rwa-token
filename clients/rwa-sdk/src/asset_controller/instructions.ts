import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { getCreatePolicyEngineIx, getPolicyEnginePda } from "../policy_engine";
import { getCreateDataRegistryIx } from "../data_registry";
import { getCreateIdentityAccountIx, getCreateIdentityRegistryIx, getIdentityAccountPda, getIdentityRegistryPda } from "../identity_registry";
import { BN } from "@coral-xyz/anchor";
import { CommonArgs, getProvider, ixReturn, parseRemainingAccounts } from "../utils";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { getAssetControllerProgram, getAssetControllerPda, getExtraMetasListPda, getTransactionApprovalAccountPda, getTrackerAccountPda } from "./utils";

// common args but with authority compulsory
export interface CreateAssetControllerIx extends CommonArgs {
    decimals: number;
    authority: string;
}

export async function getCreateAssetControllerIx(
    args: CreateAssetControllerIx
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const ix = await assetProgram.methods.createAssetController({
        decimals: args.decimals,
        authority: new PublicKey(args.authority),
        delegate: args.delegate ? new PublicKey(args.delegate) : null,
    })
        .accountsStrict({
            payer: args.payer,
            assetMint: args.assetMint,
            assetController: getAssetControllerPda(args.assetMint),
            extraMetasAccount: getExtraMetasListPda(args.assetMint),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .instruction();
    return ix;
}

export interface IssueTokenArgs extends CommonArgs {
    amount: number;
    authority: string;
}

export async function getIssueTokensIx(args: IssueTokenArgs): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const ix = await assetProgram.methods.issueTokens({
        amount: new BN(args.amount),
        to: new PublicKey(args.owner),
    }).accountsStrict({
        authority: new PublicKey(args.authority),
        assetMint: new PublicKey(args.assetMint),
        transactionApprovalAccount: getTransactionApprovalAccountPda(args.assetMint),
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        payer: args.payer,
        tokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID),
    }).instruction();
    return ix;
}

export interface TransferTokensArgs extends CommonArgs {
    from: string;
    to: string;
    amount: number;
    authority: string;
    remainingAccounts?: string[];
}

export async function getTransferTokensIx(args: TransferTokensArgs): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    let remainingAccounts = [{
        pubkey: getExtraMetasListPda(args.assetMint),
        isWritable: false,
        isSigner: false,
    }, {
        pubkey: getTransactionApprovalAccountPda(args.assetMint),
        isWritable: true,
        isSigner: false,
    }];
    remainingAccounts.push(...parseRemainingAccounts(args.remainingAccounts));
    const ix = await assetProgram.methods.transferTokens(new BN(args.amount), new PublicKey(args.to))
        .accountsStrict({
            payer: args.payer,
            assetMint: args.assetMint,
            transactionApprovalAccount: getTransactionApprovalAccountPda(args.assetMint),
            trackerAccount: getTrackerAccountPda(args.assetMint, args.from),
            signer: getAssetControllerPda(args.assetMint),
            from: args.from,
            fromTokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.from), false, TOKEN_2022_PROGRAM_ID),
            toTokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.to), false, TOKEN_2022_PROGRAM_ID),
            policyEngine: getPolicyEnginePda(args.assetMint),
            identityAccount: getIdentityAccountPda(args.assetMint, args.to),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts(remainingAccounts)
        .instruction();
    return ix;
}

export interface TransactionApprovalArgs extends CommonArgs {
    from?: string;
    to?: string;
}

export async function getCreateTransactionApprovalIx(
    args: TransactionApprovalArgs
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const ix = await assetProgram.methods.approveTransaction({
        fromTokenAccount: args.from ? new PublicKey(args.from) : null,
        toTokenAccount: args.to ? new PublicKey(args.to) : null,
        amount: args.amount ? new BN(args.amount) : null,
    })
        .accountsStrict({
            payer: args.payer,
            assetMint: args.assetMint,
            transactionApprovalAccount: getTransactionApprovalAccountPda(args.assetMint),
            systemProgram: SystemProgram.programId,
            signer: args.delegate ? new PublicKey(args.delegate) : getAssetControllerPda(args.assetMint),
            assetController: getAssetControllerPda(args.assetMint),
        })
        .instruction();
    return ix;
}

export interface CreateTokenAccountArgs extends CommonArgs {
    owner: string;
}

export async function getCreateTokenAccountIx(
    args: CreateTokenAccountArgs
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const ix = await assetProgram.methods.createTokenAccount()
        .accountsStrict({
            payer: args.payer,
            assetMint: args.assetMint,
            owner: args.owner,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            transactionApprovalAccount: getTransactionApprovalAccountPda(args.assetMint),
            tokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID),
            trackerAccount: getTrackerAccountPda(args.assetMint, args.owner)
        })
        .instruction();
    return ix;
}

export interface SetupAssetControllerArgs {
    authority: string;
    decimals: number;
    payer: string;
    delegate?: string;
}

export async function getSetupAssetControllerIxs(
    args: SetupAssetControllerArgs
): Promise<ixReturn> {
    const mintKp = new Keypair();
    const mint = mintKp.publicKey;
    const updatedArgs = { ...args, assetMint: mint.toString() };
    // get asset registry create ix
    const assetControllerCreateIx = await getCreateAssetControllerIx(
        updatedArgs
    );
    // get policy registry create ix
    const policyEngineCreateIx = await getCreatePolicyEngineIx(
        updatedArgs
    );
    // get data registry create ix
    const dataRegistryCreateIx = await getCreateDataRegistryIx(
        updatedArgs
    );
    // get identity registry create ix
    const identityRegistryCreateIx = await getCreateIdentityRegistryIx(
        updatedArgs
    );
    return {
        ixs: [
            assetControllerCreateIx,
            policyEngineCreateIx,
            dataRegistryCreateIx,
            identityRegistryCreateIx,
        ],
        signers: [mintKp],
    };

}

export interface SetupUserArgs {
    payer: string;
    owner: string;
    assetMint: string;
    level: number;
}

export async function getSetupUserIxs(args: SetupUserArgs): Promise<ixReturn> {
    let identityAccountIx = await getCreateIdentityAccountIx({
        payer: args.payer,
        signer: getIdentityRegistryPda(args.assetMint).toString(),
        assetMint: args.assetMint,
        owner: args.owner,
        level: args.level,
    });
    let from = getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID);
    let transactionApprovalIx = await getCreateTransactionApprovalIx({
        ...args,
        from: from.toString(),
        to: null,
    });
    let createTaIx = await getCreateTokenAccountIx(args);
    return {
        ixs: [
            identityAccountIx,
            transactionApprovalIx,
            createTaIx,
        ],
        signers: [],
    };
}

export interface SetupIssueTokensArgs extends CommonArgs {
    authority: string;
    owner: string;
    amount: number;
}

export async function getSetupIssueTokensIxs(
    args: SetupIssueTokensArgs
): Promise<ixReturn> {
    let tokenAccount = getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID);
    // get approve ix
    let approveIx = await getCreateTransactionApprovalIx({
        ...args,
        from: null,
        to: tokenAccount.toString(),
        amount: args.amount,
    });
    // get issue tokens ix
    let issueTokensIx = await getIssueTokensIx(args);

    return {
        ixs: [
            approveIx,
            issueTokensIx,
        ],
        signers: [],
    };
}