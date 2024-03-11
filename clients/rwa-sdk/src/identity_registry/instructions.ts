import { PublicKey, SystemProgram, type TransactionInstruction } from '@solana/web3.js';
import { type CommonArgs, getProvider } from '../utils';
import { getIdentityAccountPda, getIdentityRegistryProgram, getIdentityRegistryPda } from './utils';
import { AnchorProvider } from '@coral-xyz/anchor';

/** Common args but with authority. */
export type CreateIdentityRegistryArgs = {
	authority: string;
} & CommonArgs;

/**
 * Builds the transaction instruction to create an identity registry.
 * @param args - {@link CreateIdentityRegistryArgs}.
 * @returns Create identity registry transaction instruction.
 */
export async function getCreateIdentityRegistryIx(
	args: CreateIdentityRegistryArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
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

/** Common args but with level and owner. */
export type CreateIdentityAccountArgs = {
	level: number;
	owner: string;
} & CommonArgs;

/**
 * Builds the transaction instruction to create an identity account.
 * @param args - {@link CreateIdentityAccountArgs}.
 * @returns Create identity account transaction instruction.
 */
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


export type AddLevelToIdentityAccountArgs = {
	owner: string,
	level: number,
} & CommonArgs

/**
 * Builds the transaction instruction to add a level to identity account
 * @param args - {@link AddLevelToIdentityAccountArgs}.
 * @returns Add level to identity account transaction instruction.
 */
export async function getAddLevelToIdentityAccount(
	args: AddLevelToIdentityAccountArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
	const identityProgram = getIdentityRegistryProgram(provider);
	const ix = await identityProgram.methods.addLevelToIdentityAccount(new PublicKey(args.owner), args.level)
		.accountsStrict({
			//TOOD: Have @MACHA check this
			signer: args.signer ? args.signer : getIdentityRegistryPda(args.assetMint),
			identityRegistry: getIdentityRegistryPda(args.assetMint),
			identityAccount: getIdentityAccountPda(args.assetMint, args.owner),
		})
		.instruction();
	return ix;
}

export type RemoveLevelFromIdentityAccount = {
	owner: string,
	level: number,
} & CommonArgs

/**
 * Builds the transaction instruction to remove a level from identity account
 * @param args - {@link RemoveLevelFromIdentityAccount}.
 * @returns Add level to identity account transaction instruction.
 */
export async function getRemoveLevelFromIdentityAccount(
	args: AddLevelToIdentityAccountArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
	const identityProgram = getIdentityRegistryProgram(provider);
	const ix = await identityProgram.methods.removeLevelFromIdentityAccount(new PublicKey(args.owner), args.level)
		.accountsStrict({
			//TOOD: Have @MACHA check this
			signer: args.signer ? args.signer : getIdentityRegistryPda(args.assetMint),
			identityRegistry: getIdentityRegistryPda(args.assetMint),
			identityAccount: getIdentityAccountPda(args.assetMint, args.owner),
		})
		.instruction();
	return ix;
}

