import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { getCreatePolicyEngineIx, getPolicyEnginePda } from "../policy";
import { getCreateDataRegistryIx } from "../data";
import { getCreateIdentityAccountIx, getCreateIdentityRegistryIx, getIdentityAccountPda, getIdentityRegistryPda } from "../identity";
import { AssetController } from "../../programs/types";
import { BN, Idl, Program, Provider } from "@coral-xyz/anchor";
import { AssetControllerIdl } from "../../programs/idls";
import { getProvider, ixReturn, parseRemainingAccounts } from "..";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";

export const ASSET_CONTROLLER_PROGRAM_ID = new PublicKey("DtrBDukceZpUnWmeNzqtoBQPdXW8p9xmWYG1z7qMt8qG");

export const getAssetControllerProgram = (provider: Provider) => {
    return new Program(
        AssetControllerIdl as Idl,
        ASSET_CONTROLLER_PROGRAM_ID,
        provider
    ) as unknown as Program<AssetController>;
}

export const getAssetControllerPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(assetMint).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}

export const getExtraMetasListPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [utf8.encode("extra-account-metas"), new PublicKey(assetMint).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}

export const getTransactionApprovalAccountPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [utf8.encode("transaction-approval-account"), new PublicKey(assetMint).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}

export const getTrackerAccountPda = (assetMint: string, owner: string) => {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}

export interface SetupAssetControllerArgs {
    decimals: number;
    authority: PublicKey;
    delegate: PublicKey | null;
}

export async function getCreateAssetControllerIx(
    payer: string,
    mint: string,
    createAssetControllerArgs: SetupAssetControllerArgs
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const ix = await assetProgram.methods.createAssetController(createAssetControllerArgs)
        .accountsStrict({
            payer,
            assetMint: mint,
            assetController: getAssetControllerPda(mint),
            extraMetasAccount: getExtraMetasListPda(mint),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .instruction();
    return ix;
}

export interface IssueTokenArgs {
    mint: string;
    owner: string;
    amount: number;
    authority: string;
    payer: string;
}

export async function getIssueTokensIx(args: IssueTokenArgs): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const ix = await assetProgram.methods.issueTokens({
        amount: new BN(args.amount),
        to: new PublicKey(args.owner),
    }).accountsStrict({
        authority: new PublicKey(args.authority),
        assetMint: new PublicKey(args.mint),
        transactionApprovalAccount: getTransactionApprovalAccountPda(args.mint),
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        payer: args.payer,
        tokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.mint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID),
    }).instruction();
    return ix;
}

export interface TransferTokensArgs {
    mint: string;
    from: string;
    to: string;
    amount: number;
    authority: string;
    payer: string;
    decimals: number;
    remainingAccounts?: string[];
}

export async function getTransferTokensIx(args: TransferTokensArgs): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    let remainingAccounts = [{
        pubkey: getExtraMetasListPda(args.mint),
        isWritable: false,
        isSigner: false,
    }, {
        pubkey: getTransactionApprovalAccountPda(args.mint),
        isWritable: true,
        isSigner: false,
    }];
    remainingAccounts.push(...parseRemainingAccounts(args.remainingAccounts));
    const ix = await assetProgram.methods.transferTokens(new BN(args.amount), new PublicKey(args.to))
        .accountsStrict({
            payer: args.payer,
            assetMint: args.mint,
            transactionApprovalAccount: getTransactionApprovalAccountPda(args.mint),
            trackerAccount: getTrackerAccountPda(args.mint, args.from),
            signer: getAssetControllerPda(args.mint),
            from: args.from,
            fromTokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.mint), new PublicKey(args.from), false, TOKEN_2022_PROGRAM_ID),
            toTokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.mint), new PublicKey(args.to), false, TOKEN_2022_PROGRAM_ID),
            policyEngine: getPolicyEnginePda(args.mint),
            identityAccount: getIdentityAccountPda(args.mint, args.to),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .remainingAccounts(remainingAccounts)
        .instruction();
    return ix;
}

export interface TransactionApprovalArgs {
    mint: string;
    owner: string;
    payer: string;
    delegate?: string;
    from: string | null;
    to: string | null;
    amount: number | null;
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
            assetMint: args.mint,
            transactionApprovalAccount: getTransactionApprovalAccountPda(args.mint),
            systemProgram: SystemProgram.programId,
            signer: args.delegate ? new PublicKey(args.delegate) : getAssetControllerPda(args.mint),
        })
        .instruction();
    return ix;
}

export async function getCreateTokenAccountIx(
    payer: string,
    mint: string,
    owner: string
): Promise<TransactionInstruction> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const ix = await assetProgram.methods.createTokenAccount()
        .accountsStrict({
            payer,
            assetMint: mint,
            owner,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            transactionApprovalAccount: getTransactionApprovalAccountPda(mint),
            tokenAccount: getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(owner), false, TOKEN_2022_PROGRAM_ID),
            trackerAccount: getTrackerAccountPda(mint, owner)
        })
        .instruction();
    return ix;
}

export async function getSetupAssetControllerIxs(
    payer: string,
    authority: string,
    delegate: string,
    setupAssetControllerArgs: SetupAssetControllerArgs
): Promise<ixReturn> {
    const mintKp = new Keypair();
    const mint = mintKp.publicKey;
    // get asset registry create ix
    const assetControllerCreateIx = await getCreateAssetControllerIx(
        payer,
        mint.toString(),
        setupAssetControllerArgs,
    );
    // get policy registry create ix
    const policyEngineCreateIx = await getCreatePolicyEngineIx(
        payer,
        authority,
        delegate,
        mint.toString(),
    );
    // get data registry create ix
    const dataRegistryCreateIx = await getCreateDataRegistryIx(
        payer,
        authority,
        delegate,
        mint.toString(),
    );
    // get identity registry create ix
    const identityRegistryCreateIx = await getCreateIdentityRegistryIx(
        payer,
        authority,
        delegate,
        mint.toString(),
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
        mint: args.assetMint,
        owner: args.owner,
        payer: args.payer,
        from: from.toString(),
        to: null,
        amount: null,
    });
    let createTaIx = await getCreateTokenAccountIx(args.payer, args.assetMint, args.owner);
    return {
        ixs: [
            identityAccountIx,
            transactionApprovalIx,
            createTaIx,
        ],
        signers: [],
    };
}

export interface SetupIssueTokensArgs {
    authority: string;
    payer: string;
    owner: string;
    assetMint: string;
    amount: number;
}

export async function getSetupIssueTokensIxs(
    args: SetupIssueTokensArgs
): Promise<ixReturn> {
    let tokenAccount = getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID);
    // get approve ix
    let approveIx = await getCreateTransactionApprovalIx({
        mint: args.assetMint,
        owner: args.owner,
        payer: args.payer,
        from: null,
        to: tokenAccount.toString(),
        amount: args.amount,
    });
    // get issue tokens ix
    let issueTokensIx = await getIssueTokensIx({
        mint: args.assetMint,
        owner: args.owner,
        amount: args.amount,
        authority: args.authority,
        payer: args.payer,
    });

    return {
        ixs: [
            approveIx,
            issueTokensIx,
        ],
        signers: [],
    };
}

export interface SetupTransferTokensArgs {
    mint: string;
    from: string;
    to: string;
    amount: number;
    authority: string;
    payer: string;
    decimals: number;
}