/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	Keypair,
	PublicKey,
	SystemProgram,
	SYSVAR_INSTRUCTIONS_PUBKEY,
	TransactionInstruction,
} from "@solana/web3.js";
import {
	policyRegistryProgramId,
	getCreatePolicyEngineIx,
	getPolicyEnginePda,
	getPolicyAccountPda,
} from "../policy-engine";
import { getCreateDataRegistryIx } from "../data-registry";
import {
	identityRegistryProgramId,
	getCreateIdentityAccountIx,
	getCreateIdentityRegistryIx,
	getIdentityAccountPda,
	getIdentityRegistryPda,
} from "../identity-registry";
import {
	type CommonArgs,
	type IxReturn,
} from "../utils";
import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_2022_PROGRAM_ID,
	createAssociatedTokenAccountInstruction,
	createTransferCheckedInstruction,
	getAccount,
	getAssociatedTokenAddressSync,
	getMemoTransfer,
} from "@solana/spl-token";
import {
	getAssetControllerProgram,
	getAssetControllerPda,
	getExtraMetasListPda,
	getTrackerAccountPda,
	assetControllerProgramId,
	getAssetControllerEventAuthority,
} from "./utils";
import { type AnchorProvider, BN } from "@coral-xyz/anchor";

/** Represents arguments for creating an on chain asset controller. */
export type CreateAssetControllerIx = {
  decimals: number;
  authority: string;
  name: string;
  uri: string;
  symbol: string;
  interestRate?: number;
} & CommonArgs;

/**
 * Builds the transaction instruction to create an Asset Controller.
 * @param args - {@link CreateAssetControllerIx}
 * @returns Create asset controller transaction instruction
 */
export async function getCreateAssetControllerIx(
	args: CreateAssetControllerIx,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods
		.createAssetController({
			decimals: args.decimals,
			name: args.name,
			uri: args.uri,
			symbol: args.symbol,
			delegate: args.delegate ? new PublicKey(args.delegate) : null,
			interestRate: args.interestRate ? new BN(args.interestRate) : null,
		})
		.accountsStrict({
			payer: args.payer,
			assetMint: args.assetMint,
			assetController: getAssetControllerPda(args.assetMint),
			extraMetasAccount: getExtraMetasListPda(args.assetMint),
			systemProgram: SystemProgram.programId,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			authority: args.authority,
			eventAuthority: getAssetControllerEventAuthority(),
			program: assetControllerProgramId,
		})
		.instruction();
	return ix;
}

/** Represents arguments for update an on chain asset metadata. */
export type UpdateAssetMetadataArgs = {
	authority: string;
	name?: string;
	uri?: string;
	symbol?: string;
  } & CommonArgs;

/**
 * Builds the transaction instruction to create an Asset Controller.
 * @param args - {@link UpdateAssetMetadataArgs}
 * @returns Create asset controller transaction instruction
 */
export async function getUpdateAssetMetadataIx(
	args: UpdateAssetMetadataArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods
		.updateMetadata({
			name: args.name || null,
			uri: args.uri || null,
			symbol: args.symbol || null,
		})
		.accountsStrict({
			payer: args.payer,
			assetMint: args.assetMint,
			assetController: getAssetControllerPda(args.assetMint),
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			authority: args.authority,
			eventAuthority: getAssetControllerEventAuthority(),
			systemProgram: SystemProgram.programId,
			program: assetControllerProgramId,
		})
		.instruction();
	return ix;
}


/** Represents arguments for issuing an on chain asset/token. */
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
export async function getIssueTokensIx(
	args: IssueTokenArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods
		.issueTokens({
			amount: new BN(args.amount),
			to: new PublicKey(args.owner),
		})
		.accountsStrict({
			authority: new PublicKey(args.authority),
			assetMint: new PublicKey(args.assetMint),
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			tokenAccount: getAssociatedTokenAddressSync(
				new PublicKey(args.assetMint),
				new PublicKey(args.owner),
				false,
				TOKEN_2022_PROGRAM_ID
			),
		})
		.instruction();
	return ix;
}

export type VoidTokensArgs = {
  amount: number;
  owner: string;
} & CommonArgs;

export async function getVoidTokensIx(
	args: VoidTokensArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const ix = await assetProgram.methods
		.voidTokens(new BN(args.amount))
		.accountsStrict({
			assetMint: new PublicKey(args.assetMint),
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			tokenAccount: getAssociatedTokenAddressSync(
				new PublicKey(args.assetMint),
				new PublicKey(args.owner),
				false,
				TOKEN_2022_PROGRAM_ID
			),
			owner: args.owner,
		})
		.instruction();
	return ix;
}

export type TransferTokensArgs = {
  from: string;
  to: string;
  amount: number;
  decimals: number;
  message?: string;
  createTa?: boolean;
} & CommonArgs;

/**
 * Creates a transaction instruction to transfer a token between addresses with transfer controls.
 * @param args {@link TransferTokensArgs}
 * @returns Transaction instruction to transfer RWA token.
 */
export async function getTransferTokensIxs(
	args: TransferTokensArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction[]> {
	const remainingAccounts = [
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
			pubkey: getIdentityRegistryPda(args.assetMint),
			isWritable: false,
			isSigner: false,
		},
		{
			pubkey: getIdentityAccountPda(args.assetMint, args.to),
			isWritable: true,
			isSigner: false,
		},
		{
			pubkey: getTrackerAccountPda(args.assetMint, args.to),
			isWritable: true,
			isSigner: false,
		},
		{
			pubkey: getPolicyAccountPda(args.assetMint),
			isWritable: false,
			isSigner: false,
		},
		{
			pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
			isWritable: false,
			isSigner: false,
		},
		{
			pubkey: getExtraMetasListPda(args.assetMint),
			isWritable: false,
			isSigner: false,
		},
		{
			pubkey: assetControllerProgramId,
			isWritable: false,
			isSigner: false,
		},
	];
	const ixs: TransactionInstruction[] = [];
	try {
		const ta = await getAccount(provider.connection, getAssociatedTokenAddressSync(
			new PublicKey(args.assetMint),
			new PublicKey(args.to),
			true,
			TOKEN_2022_PROGRAM_ID
		), undefined, TOKEN_2022_PROGRAM_ID);
		const isMemoTransfer = getMemoTransfer(ta);
		if (isMemoTransfer) {
			if(!args.message) {
				throw new Error("Memo is required for memo transfer");
			}
			ixs.push(new TransactionInstruction({
				keys: [{ pubkey: new PublicKey(args.from), isSigner: true, isWritable: true }],
				data: Buffer.from(args.message, "utf-8"),
				programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
			}));
		}
	} catch (error) {
		if (args.createTa) {
			ixs.push(createAssociatedTokenAccountInstruction(new PublicKey(args.payer), getAssociatedTokenAddressSync(
				new PublicKey(args.assetMint),
				new PublicKey(args.to),
				true,
				TOKEN_2022_PROGRAM_ID
			), new PublicKey(args.to), new PublicKey(args.assetMint), TOKEN_2022_PROGRAM_ID));
		}
	}
	const ix = createTransferCheckedInstruction(
		getAssociatedTokenAddressSync(
			new PublicKey(args.assetMint),
			new PublicKey(args.from),
			true,
			TOKEN_2022_PROGRAM_ID
		),
		new PublicKey(args.assetMint),
		getAssociatedTokenAddressSync(
			new PublicKey(args.assetMint),
			new PublicKey(args.to),
			true,
			TOKEN_2022_PROGRAM_ID
		),
		new PublicKey(args.from),
		args.amount,
		args.decimals,
		[],
		TOKEN_2022_PROGRAM_ID
	);
	ix.keys = ix.keys.concat(remainingAccounts);

	ixs.push(ix);
	return ixs;
}

export type CreateTokenAccountArgs = {
  owner: string;
  memoTransfer?: boolean;
} & CommonArgs;

export async function getCreateTokenAccountIx(
	args: CreateTokenAccountArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods
		.createTokenAccount({
			memoTransfer: args.memoTransfer || false,
		})
		.accountsStrict({
			payer: args.payer,
			assetMint: args.assetMint,
			owner: args.owner,
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			assetController: getAssetControllerPda(args.assetMint),
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			systemProgram: SystemProgram.programId,
			tokenAccount: getAssociatedTokenAddressSync(
				new PublicKey(args.assetMint),
				new PublicKey(args.owner),
				false,
				TOKEN_2022_PROGRAM_ID
			),
			trackerAccount: getTrackerAccountPda(args.assetMint, args.owner),
			program: assetControllerProgramId,
			eventAuthority: getAssetControllerEventAuthority(),
		})
		.instruction();
	return ix;
}

/** Args used to generate new asset controller */
export type SetupAssetControllerArgs = {
  authority: string;
  decimals: number;
  payer: string;
  delegate?: string;
  name: string;
  uri: string;
  symbol: string;
  interestRate?: number;
};

/**
 * Generates a new asset controller.
 * This includes generation of a new key pair, a new asset registry, policy registry, data registry, identity registry.
 * @param args - {@link SetupAssetControllerArgs}
 * @returns - {@link IxReturn}, an object of the initialize transaction instructions and a new keypair.
 */
export async function getSetupAssetControllerIxs(
	args: SetupAssetControllerArgs,
	provider: AnchorProvider
): Promise<IxReturn> {
	const mintKp = new Keypair();
	const mint = mintKp.publicKey;
	const updatedArgs = { ...args, assetMint: mint.toString(), signer: args.authority };
	// Get asset registry create ix
	const assetControllerCreateIx = await getCreateAssetControllerIx(
		updatedArgs,
		provider
	);
	// Get policy registry create ix
	const policyEngineCreateIx = await getCreatePolicyEngineIx(
		updatedArgs,
		provider
	);
	// Get data registry create ix
	const dataRegistryCreateIx = await getCreateDataRegistryIx(
		updatedArgs,
		provider
	);
	// Get identity registry create ix
	const identityRegistryCreateIx = await getCreateIdentityRegistryIx(
		updatedArgs,
		provider
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

/** Args used to setup user */
export type SetupUserArgs = {
  payer: string;
  owner: string;
  signer: string;
  assetMint: string;
  level: number;
  memoTransfer?: boolean;
};

/**
 * Generate instructions to set up a user for permissioned based assets.
 * This function constructs the instructions necessary for setting up a user, which includes
 * creating an identity account, indicating permissions, and a token account for the user.
 * @param args {@link SetupUserArgs}
 * @returns - {@link IxReturn}, a promise that resolves to a list of generated transaction instructions.
 */
export async function getSetupUserIxs(
	args: SetupUserArgs,
	provider: AnchorProvider
): Promise<IxReturn> {
	const identityAccountIx = await getCreateIdentityAccountIx(
		{
			payer: args.payer,
			signer: args.signer,
			assetMint: args.assetMint,
			owner: args.owner,
			level: args.level,
		},
		provider
	);
	const createTaIx = await getCreateTokenAccountIx(args, provider);
	return {
		ixs: [identityAccountIx, createTaIx],
		signers: [],
	};
}

export type InterestBearingMintArgs = {
	rate: number;
	authority: string;
  } & CommonArgs;

/**
 * Generate Instructions to update interest rate
 * @param args - {@link InterestRateArgs}
 * @returns - {@link TransactionInstruction}
 * */
export async function getUpdateInterestBearingMintRateIx(
	args: { rate: number, authority: string } & CommonArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods
		.updateInterestBearingMintRate(new BN(args.rate))
		.accountsStrict({
			authority: new PublicKey(args.authority),
			assetMint: new PublicKey(args.assetMint),
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			assetController: getAssetControllerPda(args.assetMint),
			program: assetControllerProgramId,
			eventAuthority: getAssetControllerEventAuthority(),
		})
		.instruction();
	return ix;
}

export type MemoTranferArgs = {
	owner: string;
	tokenAccount: string;
};

/**
 * Generate Instructions to disable memo transfer
 * @param args - {@link MemoTranferArgs}
 * @returns - {@link TransactionInstruction}
 * */
export async function getDisableMemoTransferIx(
	args: MemoTranferArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods
		.disableMemoTransfer()
		.accountsStrict({
			owner: new PublicKey(args.owner),
			tokenAccount: new PublicKey(args.tokenAccount),
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			program: assetControllerProgramId,
			eventAuthority: getAssetControllerEventAuthority(),
		})
		.instruction();
	return ix;
}

export type CloseMintArgs = {
	authority: string;
} & CommonArgs;

/**
 * Generate Instructions to close a mint
 * @param args - {@link CloseMintArgs}
 * @returns - {@link TransactionInstruction}
 */
export async function getCloseMintIx(
	args: CloseMintArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const assetProgram = getAssetControllerProgram(provider);
	const ix = await assetProgram.methods
		.closeMintAccount()
		.accountsStrict({
			authority: new PublicKey(args.authority),
			assetMint: new PublicKey(args.assetMint),
			tokenProgram: TOKEN_2022_PROGRAM_ID,
			assetController: getAssetControllerPda(args.assetMint),
		})
		.instruction();
	return ix;
}