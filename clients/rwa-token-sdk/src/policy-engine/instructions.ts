import {
	PublicKey,
	SystemProgram,
	type TransactionInstruction,
} from "@solana/web3.js";
import { type CommonArgs, type IxReturn } from "../utils";
import {
	getPolicyAccountPda,
	getPolicyEnginePda,
	getPolicyEngineProgram,
	getPolicyEnginerEventAuthority,
	getTrackerAccountPda,
} from "./utils";
import { type PolicyType, type IdentityFilter } from "./types";
import { type AnchorProvider } from "@coral-xyz/anchor";

/** Represents the arguments required to create a policy engine account. */
export type CreatePolicyEngineArgs = {
  authority: string;
  signer: string;
} & CommonArgs;

/**
 * Generate instructions to create a new policy account.
 * @param args {@link CreatePolicyEngineArgs}.
 * @returns Create policy engine transaction instruction.
 */
export async function getCreatePolicyEngineIx(
	args: CreatePolicyEngineArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const policyProgram = getPolicyEngineProgram(provider);
	const ix = await policyProgram.methods
		.createPolicyEngine(
			new PublicKey(args.authority),
			args.delegate ? new PublicKey(args.delegate) : null
		)
		.accountsStrict({
			payer: args.payer,
			signer: args.signer,
			assetMint: args.assetMint,
			policyEngine: getPolicyEnginePda(args.assetMint),
			systemProgram: SystemProgram.programId,
		})
		.instruction();
	return ix;
}

/** Represents the arguments required to attach a policy to an asset. */
export type AttachPolicyArgs = {
  authority: string;
  assetMint: string;
  payer: string;
  identityFilter: IdentityFilter;
  policyType: PolicyType;
};

/** Represents the arguments required to detach a policy from an asset. */
export type DetachPolicyArgs = {
	authority: string;
	owner: string;
	assetMint: string;
	payer: string;
	hash: string;
  };

/**
 * Generate instructions to connect am policy to an asset.
 *
 * This function constructs an instruction to attach a policy account to an asset
 * using the provided arguments. It calls the policy engine program to attach the policy account,
 * and returns the generated instruction along with the required signers.
 *
 * @param args {@link AttachPolicyArgs}
 * @returns - {@link IxReturn}, a list of transaction instructions and a new key pair responsible to sign it.
 */
export async function getAttachToPolicyAccountIx(
	args: AttachPolicyArgs,
	provider: AnchorProvider
): Promise<IxReturn> {
	const policyProgram = getPolicyEngineProgram(provider);
	const policyAccount = getPolicyAccountPda(args.assetMint);
	const ix = await policyProgram.methods
		.attachToPolicyAccount(args.identityFilter, args.policyType)
		.accountsStrict({
			policyAccount,
			signer: new PublicKey(args.authority),
			payer: args.payer,
			policyEngine: getPolicyEnginePda(args.assetMint),
			systemProgram: SystemProgram.programId,
		})
		.instruction();
	return {
		ixs: [ix],
		signers: [],
	};
}


/**
 * Generate instructions to detach an identity policy account to an asset.
 *
 * This function constructs an instruction to attach a policy account to an asset
 * using the provided arguments. It creates a new policy account, calls the policy
 * engine program to attach the policy account, and returns the generated instruction
 * along with the required signers.
 *
 * @param args {@link AttachPolicyArgs}
 * @returns - {@link IxReturn}, a list of transaction instructions and a new key pair responsible to sign it.
 */
export async function getDetachFromPolicyAccountIx(
	args: DetachPolicyArgs,
	provider: AnchorProvider
): Promise<IxReturn> {
	const policyProgram = getPolicyEngineProgram(provider);
	const policyAccount = getPolicyAccountPda(args.assetMint);
	const ix = await policyProgram.methods
		.detachFromPolicyAccount(args.hash)
		.accountsStrict({
			policyAccount,
			signer: new PublicKey(args.authority),
			payer: args.payer,
			policyEngine: getPolicyEnginePda(args.assetMint),
			systemProgram: SystemProgram.programId,
		})
		.instruction();
	return {
		ixs: [ix],
		signers: [],
	};
}

export async function getCreatePolicyAccountIx(
	args: AttachPolicyArgs,
	provider: AnchorProvider
): Promise<IxReturn> {
	const policyProgram = getPolicyEngineProgram(provider);
	const policyAccount = getPolicyAccountPda(args.assetMint);
	const ix = await policyProgram.methods
		.createPolicyAccount(args.identityFilter, args.policyType)
		.accountsStrict({
			policyAccount,
			signer: new PublicKey(args.authority),
			payer: args.payer,
			policyEngine: getPolicyEnginePda(args.assetMint),
			systemProgram: SystemProgram.programId,
		})
		.instruction();
	return {
		ixs: [ix],
		signers: [],
	};
}

export interface CreateTrackerAccountArgs {
	payer: string;
	owner: string;
	assetMint: string;
}

export async function getCreateTrackerAccountIx(
	args: CreateTrackerAccountArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const policyProgram = getPolicyEngineProgram(provider);
	const trackerAccount = getTrackerAccountPda(args.assetMint, args.owner);
	const ix = await policyProgram.methods
		.createTrackerAccount()
		.accountsStrict({
			payer: args.payer,
			trackerAccount,
			owner: new PublicKey(args.owner),
			systemProgram: SystemProgram.programId,
			program: policyProgram.programId,
			assetMint: new PublicKey(args.assetMint),
			eventAuthority: getPolicyEnginerEventAuthority(),
		})
		.instruction();
	return ix;
}