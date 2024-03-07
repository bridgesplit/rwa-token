import { PublicKey, SystemProgram, type TransactionInstruction } from '@solana/web3.js';
import { type CommonArgs, getProvider } from '../utils';
import { getDataRegistryProgram, getDataRegistryPda } from './utils';
import { getDataAccounts, getDataRegistryAccount } from './data';
import { DataRegistryAccount } from './types';

/** Common args but with authority. */
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

// export enum DataAccountType {
// 	Title,
// 	Legal,
// 	Tax,
// 	Miscellaneous
// }

// export type UpdateDataAccountArgs = {
// 	type: DataAccountType;
// 	name: string;
// 	uri: string;
// };

// export type UpdateDataAccountArgsStatic = {
// 	updateAccountArgs: UpdateDataAccountArgs,
// 	dataAccount: PublicKey,
// } & CommonArgs

// /**
//  * Builds the transaction instruction to update a data registry.
//  * @param args - {@link UpdateDataAccountArgs}.
//  * @returns Create update data registry transaction instruction.
//  */
// export async function getUpdateDataRegistryIx(
// 	args: UpdateDataAccountArgsStatic,
// ): Promise<TransactionInstruction> {
// 	const provider = getProvider();
// 	const dataProgram = getDataRegistryProgram(provider);

// 	const ix = await dataProgram.methods.updateDataAccount(args.updateAccountArgs)
// 		.accounts({
// 			signer: args.assetMint,
// 			dataRegistry: getDataRegistryPda(args.assetMint),
// 			dataAccount: args.dataAccount,
// 		})
// 		.instruction();

// 	return ix;
// }
