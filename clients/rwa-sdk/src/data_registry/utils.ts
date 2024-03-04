import {type Idl, Program, type Provider} from '@coral-xyz/anchor';
import {DataRegistryIdl} from '../programs/idls';
import {PublicKey} from '@solana/web3.js';
import {type DataRegistry} from '../programs/types';

/** Address of the data registry program. */
export const dataRegistryProgramId = new PublicKey('8WRaNVNMDqdwADbKYj7fBd47i2e5SFMSEs8TrA2Vd5io');

/**
 * Returns the data registry program as a typed anchor program.
 * @param provider - Solana anchor provider.
 * @returns Typed solana program to be used for transaction building.
 */
export const getDataRegistryProgram = (provider: Provider) => new Program(
	DataRegistryIdl as Idl,
	dataRegistryProgramId,
	provider,
) as unknown as Program<DataRegistry>;

/**
 * Retrieves the data registry pda public key for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The data registry pda.
 */
export const getDataRegistryPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	dataRegistryProgramId,
)[0];
