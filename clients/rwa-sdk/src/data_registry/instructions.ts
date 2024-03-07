import {
	Keypair, PublicKey, SystemProgram, type TransactionInstruction,
} from '@solana/web3.js';
import {type CommonArgs, getProvider, type IxReturn} from '../utils';
import {getDataRegistryProgram, getDataRegistryPda} from './utils';
import {IdlTypes} from '@coral-xyz/anchor';
import {DataRegistry} from '../programs';
import {type DataAccountType} from './types';

export type CreateDataRegistryArgs = {
	authority: string;
} & CommonArgs;

export async function getCreateDataRegistryIx(
	args: CreateDataRegistryArgs,
): Promise<TransactionInstruction> {
	const provider = getProvider();
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
