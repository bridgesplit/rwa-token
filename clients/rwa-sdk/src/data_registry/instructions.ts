import {PublicKey, SystemProgram, type TransactionInstruction} from '@solana/web3.js';
import {type CommonArgs, getProvider} from '../utils';
import {getDataRegistryProgram, getDataRegistryPda} from './utils';

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
