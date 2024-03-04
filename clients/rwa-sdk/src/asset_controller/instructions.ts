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

/** Common args with authority and decimals. */
export type CreateAssetControllerIx = {
	decimals: number;
	authority: string;
} & CommonArgs;

/**
 * Builds the transaction instruction to create an Asset Controller.
 * @param args - {@link CreateAssetControllerIx}
 * @returns Create asset controller transaction instruction
 */
export async function getCreateAssetControllerIx(
	args: CreateAssetControllerIx,
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

/** Common args but with authority, owner and amount.*/
export type IssueTokenArgs = {
	amount: number;
	authority: string;
	owner: string;
} & CommonArgs;

/**
 * Creates transaction instruction to issue tokens for a specific amount for a specific asset.
 * @param args {@link IssueTokenArgs}
 * @returns A transaction instruction distributing the specified amount for the specific asset.
 */
export async function getIssueTokensIx(args: IssueTokenArgs): Promise<TransactionInstruction> {
	const provider = getProvider();
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods.issueTokens({
		amount: args.amount,
		to: new PublicKey(args.owner),
	}).accountsStrict({
		authority: new PublicKey(args.authority),
		assetMint: new PublicKey(args.assetMint),
		tokenProgram: TOKEN_2022_PROGRAM_ID,
		tokenAccount: getAssociatedTokenAddressSync(new PublicKey(args.assetMint), new PublicKey(args.owner), false, TOKEN_2022_PROGRAM_ID),
	}).instruction();
	return ix;
}

/** Common args but with transfer details.*/
export type TransferTokensArgs = {
	from: string;
	to: string;
	amount: number;
	authority: string;
	decimals: number;
	/** Optional parameter for transfer controls (policies) and privacy (identity). */
	remainingAccounts?: string[];
} & CommonArgs;

/**
 * Creates a transaction instruction to transfer a token between addresses with transfer controls.
 * @param args {@link TransferTokensArgs}
 * @returns Transaction instruction to transfer RWA token.
 */
export async function getTransferTokensIx(args: TransferTokensArgs): Promise<TransactionInstruction> {
	const provider = getProvider();
	const assetProgram = getAssetControllerProgram(provider);
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

//** Args to used to generate new asset controller*/
export type SetupAssetControllerArgs = {
	authority: string;
	decimals: number;
	payer: string;
	delegate?: string;
};

/**
* Generates a new asset controller.
* This includes generation of a new key pair, a new asset registry, policy registry, data registry, identity registry.
* @param args - {@link SetupAssetControllerArgs}
* @returns - {@link IxReturn}, an object of the initialize transaction instructions and a new keypair.
*/
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

/** Args used to setup user*/
export type SetupUserArgs = {
	payer: string;
	owner: string;
	assetMint: string;
	level: number;
};

/**
 * Generate instructions to set up a user for permissioned based assets.
 * This function constructs the instructions necessary for setting up a user, which includes
 * creating an identity account, indicating permissions, and a token account for the user.
 * @param args {@link SetupUserArgs}
 * @returns - {@link IxReturn}, a promise that resolves to a list of generated transaction instructions.
 */
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

/** Args used to setup and issue tokens. */
export type SetupIssueTokensArgs = {
	authority: string;
	owner: string;
	amount: number;
} & CommonArgs;


/**
 * Creates a list of transaction instructions to issue tokens for a specific amount for a specific asset.
 * @param args - {@link SetupIssueTokensArgs}
 * @returns - {@link IxReturn}, a promise that resolves to a list of generated transaction instructions for issuing RWA tokens at specific amounts.
 */
export async function getSetupIssueTokensIxs(
	args: SetupIssueTokensArgs,
): Promise<IxReturn> {
	// Get issue tokens ix
	const issueTokensIx = await getIssueTokensIx(args);

	return {
		ixs: [
			issueTokensIx,
		],
		signers: [],
	};
}
