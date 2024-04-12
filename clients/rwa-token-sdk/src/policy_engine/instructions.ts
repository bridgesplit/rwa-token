import {
	Keypair, PublicKey, SystemProgram, type TransactionInstruction,
} from '@solana/web3.js';
<<<<<<< HEAD
import {type CommonArgs, getProvider, type IxReturn} from '../utils';
import {getPolicyAccountPda, getPolicyEnginePda, getPolicyEngineProgram} from './utils';
import {type PolicyType, type IdentityFilter, type Policy} from './types';
=======
import {type CommonArgs, type IxReturn} from '../utils';
import {getPolicyEnginePda, getPolicyEngineProgram} from './utils';
import {type IdentityFilter, type Policy} from './types';
import {type AnchorProvider} from '@coral-xyz/anchor';
>>>>>>> feat/sdk-docs-main/dashboards

/** Represents the arguments required to create a policy. */
export type CreatePolicyEngineArgs = {
	authority: string;
} & CommonArgs;

/**
 * Generate instructions to create a new policy account.
 * @param args {@link CreatePolicyEngineArgs}.
 * @returns Create policy engine transaction instruction.
 */
export async function getCreatePolicyEngineIx(
	args: CreatePolicyEngineArgs,
	provider: AnchorProvider,
): Promise<TransactionInstruction> {
	const policyProgram = getPolicyEngineProgram(provider);
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

/** Represents the arguments required to attach a policy to an assets. */
export type AttachPolicyArgs = {
	authority: string;
	owner: string;
	assetMint: string;
	payer: string;
	identityFilter: IdentityFilter;
	policyType: PolicyType;
};

/** TODO: Cleanup unused helper function */
export function padIdentityLevels(levels: number[]): number[] {
	const maxLevels = 10;
	return levels.concat(new Array(maxLevels - levels.length).fill(0));
}

<<<<<<< HEAD
export async function getAttachToPolicyAccountIx(
=======
/**
 * Generate instructions to connect an identity policy account to an asset.
 *
 * This function constructs an instruction to attach a policy account to an asset
 * using the provided arguments. It creates a new policy account, calls the policy
 * engine program to attach the policy account, and returns the generated instruction
 * along with the required signers.
 *
 * @param args {@link AttachPolicyArgs}
 * @returns - {@link IxReturn}, a list of transaction instructions and a new key pair responsible to sign it.
 */
export async function getAttachPolicyAccountIx(
>>>>>>> feat/sdk-docs-main/dashboards
	args: AttachPolicyArgs,
	provider: AnchorProvider,
): Promise<IxReturn> {
	const policyProgram = getPolicyEngineProgram(provider);
	const policyAccount = getPolicyAccountPda(args.assetMint);
	const ix = await policyProgram.methods.attachToPolicyAccount(
		args.identityFilter,
		args.policyType,
	).accountsStrict({
		policyAccount,
		signer: new PublicKey(args.authority),
		payer: args.payer,
		policyEngine: getPolicyEnginePda(args.assetMint),
		systemProgram: SystemProgram.programId,
	}).instruction();
	return {
		ixs: [ix],
		signers: [],
	};
}

export async function getCreatePolicAccountIx(
	args: AttachPolicyArgs,
): Promise<IxReturn> {
	const provider = getProvider();
	const policyProgram = getPolicyEngineProgram(provider);
	const policyAccount = getPolicyAccountPda(args.assetMint);
	const ix = await policyProgram.methods.createPolicyAccount(
		args.identityFilter,
		args.policyType,
	)
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
