import {
	Keypair, PublicKey, SystemProgram, type TransactionInstruction,
} from '@solana/web3.js';
import {type CommonArgs, getProvider, type IxReturn} from '../utils';
import {getPolicyAccountPda, getPolicyEnginePda, getPolicyEngineProgram} from './utils';
import {type PolicyType, type IdentityFilter, type Policy} from './types';

export type CreatePolicyEngineArgs = {
	authority: string;
} & CommonArgs;

export async function getCreatePolicyEngineIx(
	args: CreatePolicyEngineArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
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

export type AttachPolicyArgs = {
	authority: string;
	owner: string;
	assetMint: string;
	payer: string;
	identityFilter: IdentityFilter;
	policyType: PolicyType;
};

export function padIdentityLevels(levels: number[]): number[] {
	const maxLevels = 10;
	return levels.concat(new Array(maxLevels - levels.length).fill(0));
}

export async function getAttachToPolicyAccountIx(
	args: AttachPolicyArgs,
): Promise<IxReturn> {
	const provider = getProvider();
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

export async function getCreatePolicyAccountIx(
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
