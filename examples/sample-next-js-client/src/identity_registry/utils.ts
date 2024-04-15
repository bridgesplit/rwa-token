import {type Idl, Program, type Provider} from '@bridgesplit/anchor';
import {IdentityRegistryIdl} from '../programs/idls';
import {PublicKey} from '@solana/web3.js';
import {type IdentityRegistryIdlType} from '../programs/types';

/** Address of the identity registry program. */
export const identityRegistryProgramId = new PublicKey('idtynCMYbdisCTv4FrCWPSQboZb1uM4TV2cPi79yxQf');

export const getIdentityRegistryProgram = (provider: Provider) => new Program(
	IdentityRegistryIdl as Idl,
	identityRegistryProgramId,
	provider,
) as unknown as Program<IdentityRegistryIdlType>;

/**
 * Retrieves the identity registry pda public key for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The identity registry pda.
 */
export const getIdentityRegistryPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	identityRegistryProgramId,
)[0];

/**
 * Retrieves the identity account pda public key for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @param owner - The string representation of the asset's owner.
 * @returns The identity account pda.
 */
export const getIdentityAccountPda = (assetMint: string, owner: string) => PublicKey.findProgramAddressSync(
	[getIdentityRegistryPda(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
	identityRegistryProgramId,
)[0];
