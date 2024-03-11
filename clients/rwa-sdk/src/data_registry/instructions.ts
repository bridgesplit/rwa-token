import {
	Keypair, PublicKey, SystemProgram, type TransactionInstruction,
} from '@solana/web3.js';
import {type CommonArgs, getProvider, type IxReturn} from '../utils';
import {getDataRegistryProgram, getDataRegistryPda} from './utils';
import {type DataAccountType} from './types';
import { AnchorProvider } from '@coral-xyz/anchor';

export type CreateDataRegistryArgs = {
	authority: string;
} & CommonArgs;

/**
 * Builds the transaction instruction to create a data registry.
 * @param args - {@link CreateDataRegistryArgs}.
 * @returns Create data registry transaction instruction.
 */
export async function getCreateDataRegistryIx(
	args: CreateDataRegistryArgs,
	provider: AnchorProvider
): Promise<TransactionInstruction> {
	const dataProgram = getDataRegistryProgram(provider);
	const ix = await dataProgram.methods.createDataRegistry(new PublicKey(args.authority), args.delegate ? new PublicKey(args.delegate) : null)
		.accountsStrict({
			payer: args.payer,
			assetMint: args.assetMint,
			dataRegistry: getDataRegistryPda(args.assetMint),
			systemProgram: SystemProgram.programId,
		})
		.instruction();
	return ix;
}

export type CreateDataAccountArgs = {
	type: DataAccountType;
	name: string;
	uri: string;
} & CommonArgs;

export async function getCreateDataAccountIx(
	args: CreateDataAccountArgs,
): Promise<IxReturn> {
	const provider = getProvider();
	const dataProgram = getDataRegistryProgram(provider);
	const dataAccountKp = new Keypair();
	const ix = await dataProgram.methods.createDataAccount({
		type: args.type,
		name: args.name,
		uri: args.uri,
	})
		.accountsStrict({
			payer: args.payer,
			signer: args.signer ? args.signer : getDataRegistryPda(args.assetMint),
			dataRegistry: getDataRegistryPda(args.assetMint),
			dataAccount: dataAccountKp.publicKey,
			systemProgram: SystemProgram.programId,
		})
		.instruction();
	return {
		ixs: [ix],
		signers: [dataAccountKp],
	};
}

export type UpdateDataAccountArgs = {
	dataAccount: string;
	name: string;
	uri: string;
	type: DataAccountType;
} & CommonArgs;

export async function getUpdateDataAccountIx(
	args: UpdateDataAccountArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
	const dataProgram = getDataRegistryProgram(provider);
	const ix = await dataProgram.methods.updateDataAccount({
		name: args.name,
		uri: args.uri,
		type: args.type,
	})
		.accountsStrict({
			signer: args.signer ? args.signer : getDataRegistryPda(args.assetMint),
			dataRegistry: getDataRegistryPda(args.assetMint),
			dataAccount: args.dataAccount,
		})
		.instruction();
	return ix;
}

export type DelegateDataRegistryArgs = {
	delegate: string;
	authority: string;
} & CommonArgs;

export async function getDelegateDataRegistryIx(
	args: DelegateDataRegistryArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
	const dataProgram = getDataRegistryProgram(provider);
	const ix = await dataProgram.methods.delegateDataRegsitry(
		new PublicKey(args.delegate),
	)
		.accountsStrict({
			dataRegistry: getDataRegistryPda(args.assetMint),
			authority: args.authority,
		})
		.instruction();
	return ix;
}
