import {PublicKey, SystemProgram, type TransactionInstruction} from '@solana/web3.js';
import {type CommonArgs, getProvider} from '../utils';
import {getIdentityAccountPda, getIdentityRegistryProgram, getIdentityRegistryPda} from './utils';

export type CreateIdentityRegistryArgs = {
	authority: string;
} & CommonArgs;

export async function getCreateIdentityRegistryIx(
	args: CreateIdentityRegistryArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
	const identityProgram = getIdentityRegistryProgram(provider);
	const ix = await identityProgram.methods.createIdentityRegistry(new PublicKey(args.authority), args.delegate ? new PublicKey(args.delegate) : null)
		.accountsStrict({
			payer: args.payer,
			assetMint: args.assetMint,
			identityRegistryAccount: getIdentityRegistryPda(args.assetMint),
			systemProgram: SystemProgram.programId,
		})
		.instruction();
	return ix;
}

export type CreateIdentityAccountArgs = {
	level: number;
	owner: string;
} & CommonArgs;

export async function getCreateIdentityAccountIx(
	args: CreateIdentityAccountArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
	const identityProgram = getIdentityRegistryProgram(provider);
	const ix = await identityProgram.methods.createIdentityAccount(new PublicKey(args.owner), args.level)
		.accountsStrict({
			payer: args.payer,
			identityRegistry: getIdentityRegistryPda(args.assetMint),
			identityAccount: getIdentityAccountPda(args.assetMint, args.owner),
			systemProgram: SystemProgram.programId,
			signer: args.signer ? args.signer : getIdentityRegistryPda(args.assetMint),
		})
		.instruction();
	return ix;
}