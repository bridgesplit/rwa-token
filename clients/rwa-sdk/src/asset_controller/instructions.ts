/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	Keypair, PublicKey, SystemProgram, type TransactionInstruction,
} from '@solana/web3.js';
import {policyRegistryProgramId, getCreatePolicyEngineIx, getPolicyEnginePda} from '../policy_engine';
import {getCreateDataRegistryIx} from '../data_registry';
import {
	identityRegistryProgramId, getCreateIdentityAccountIx, getCreateIdentityRegistryIx, getIdentityAccountPda, getIdentityRegistryPda,
} from '../identity_registry';
import {
	type CommonArgs, getProvider, type IxReturn, parseRemainingAccounts,
} from '../utils';
import {
	ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, createTransferCheckedInstruction, getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
	getAssetControllerProgram, getAssetControllerPda, getExtraMetasListPda, getTrackerAccountPda,
} from './utils';
import {BN} from '@coral-xyz/anchor';

// Common args but with authority compulsory
export type CreateAssetControllerIx = {
	decimals: number;
	authority: string;
	name: string;
	uri: string;
	symbol: string;
} & CommonArgs;

export async function getCreateAssetControllerIx(
	args: CreateAssetControllerIx,
): Promise<TransactionInstruction> {
	const provider = getProvider();
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods.createAssetController({
		decimals: args.decimals,
		name: args.name,
		uri: args.uri,
		symbol: args.symbol,
		delegate: args.delegate ? new PublicKey(args.delegate) : null,
	})
		.accountsStrict({
			payer: args.payer,
			assetMint: args.assetMint,
			assetController: getAssetControllerPda(args.assetMint),
			extraMetasAccount: getExtraMetasListPda(args.assetMint),
			systemProgram: SystemProgram.programId,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			authority: args.authority,
		})
		.instruction();
	return ix;
}

export type IssueTokenArgs = {
	amount: number;
	authority: string;
	owner: string;
} & CommonArgs;

export async function getIssueTokensIx(args: IssueTokenArgs): Promise<TransactionInstruction> {
	const provider = getProvider();
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods.issueTokens({
		amount: new BN(args.amount),
		to: new PublicKey(args.owner),
	}).accountsStrict({
		authority: new PublicKey(args.authority),
		assetMint: new PublicKey(args.assetMint),
		tokenProgram: TOKEN_2022_PROGRAM_ID,
		tokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID),
	}).instruction();
	return ix;
}

export type VoidTokensArgs = {
	amount: number;
	owner: string;
} & CommonArgs;

export async function getVoidTokensIx(args: VoidTokensArgs): Promise<TransactionInstruction> {
	const provider = getProvider();
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods.voidTokens({
		amount: new BN(args.amount),
	}).accountsStrict({
		assetMint: new PublicKey(args.assetMint),
		tokenProgram: TOKEN_2022_PROGRAM_ID,
		tokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID),
		owner: args.owner,
	}).instruction();
	return ix;
}

export type TransferTokensArgs = {
	from: string;
	to: string;
	amount: number;
	authority: string;
	decimals: number;
	remainingAccounts?: string[];
} & CommonArgs;

export async function getTransferTokensIx(args: TransferTokensArgs): Promise<TransactionInstruction> {
	const remainingAccounts = [{
		pubkey: getExtraMetasListPda(args.assetMint),
		isWritable: false,
		isSigner: false,
	},
	{
		pubkey: policyRegistryProgramId,
		isWritable: false,
		isSigner: false,
	},
	{
		pubkey: getPolicyEnginePda(args.assetMint),
		isWritable: false,
		isSigner: false,
	},
	{
		pubkey: identityRegistryProgramId,
		isWritable: false,
		isSigner: false,
	},
	{
		pubkey: getIdentityAccountPda(args.assetMint, args.from),
		isWritable: false,
		isSigner: false,
	},
	{
		pubkey: getTrackerAccountPda(args.assetMint, args.from),
		isWritable: false,
		isSigner: false,
	}];
	remainingAccounts.push(...parseRemainingAccounts(args.remainingAccounts));
	const ix = createTransferCheckedInstruction(
		getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.from), false, TOKEN_2022_PROGRAM_ID),
		new PublicKey(args.assetMint),
		getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.to), false, TOKEN_2022_PROGRAM_ID),
		new PublicKey(args.from),
		args.amount,
		args.decimals,
		[],
		TOKEN_2022_PROGRAM_ID,
	);
	ix.keys = ix.keys.concat(remainingAccounts);

	return ix;
}

export type CreateTokenAccountArgs = {
	owner: string;
} & CommonArgs;

export async function getCreateTokenAccountIx(
	args: CreateTokenAccountArgs,
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
			tokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID),
			trackerAccount: getTrackerAccountPda(args.assetMint, args.owner),
		})
		.instruction();
	return ix;
}

export type SetupAssetControllerArgs = {
	authority: string;
	decimals: number;
	payer: string;
	delegate?: string;
	name: string;
	uri: string;
	symbol: string;
};

export async function getSetupAssetControllerIxs(
	args: SetupAssetControllerArgs,
): Promise<IxReturn> {
	const mintKp = new Keypair();
	const mint = mintKp.publicKey;
	const updatedArgs = {...args, assetMint: mint.toString()};
	// Get asset registry create ix
	const assetControllerCreateIx = await getCreateAssetControllerIx(
		updatedArgs,
	);
	// Get policy registry create ix
	const policyEngineCreateIx = await getCreatePolicyEngineIx(
		updatedArgs,
	);
	// Get data registry create ix
	const dataRegistryCreateIx = await getCreateDataRegistryIx(
		updatedArgs,
	);
	// Get identity registry create ix
	const identityRegistryCreateIx = await getCreateIdentityRegistryIx(
		updatedArgs,
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

export type SetupUserArgs = {
	payer: string;
	owner: string;
	assetMint: string;
	level: number;
};

export async function getSetupUserIxs(args: SetupUserArgs): Promise<IxReturn> {
	const identityAccountIx = await getCreateIdentityAccountIx({
		payer: args.payer,
		signer: getIdentityRegistryPda(args.assetMint).toString(),
		assetMint: args.assetMint,
		owner: args.owner,
		level: args.level,
	});
	const createTaIx = await getCreateTokenAccountIx(args);
	return {
		ixs: [
			identityAccountIx,
			createTaIx,
		],
		signers: [],
	};
}
