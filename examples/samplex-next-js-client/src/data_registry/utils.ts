import {type Idl, Program, type Provider} from '@coral-xyz/anchor';
import {DataRegistryIdl} from '../programs/idls';
import {PublicKey} from '@solana/web3.js';
import {type DataRegistryIdlType} from '../programs/types';

export const dataRegistryProgramId = new PublicKey('dataeP5X1e7XsWN1ovDSEDP5cqaEUnKBmHE5iZhXPVw');

/**
 * Returns the data registry program as a typed anchor program.
 * @param provider - Solana anchor provider.
 * @returns Typed solana program to be used for transaction building.
 */
export const getDataRegistryProgram = (provider: Provider) => new Program(
	DataRegistryIdl as Idl,
	dataRegistryProgramId,
	provider,
) as unknown as Program<DataRegistryIdlType>;

/**
 * Retrieves the data registry pda public key for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The data registry pda.
 */
export const getDataRegistryPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	dataRegistryProgramId,
)[0];
