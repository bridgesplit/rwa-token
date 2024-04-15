import { type Idl, Program, type Provider } from '@bridgesplit/anchor';
import { PolicyEngineIdl } from '../programs/idls';
import { PublicKey } from '@solana/web3.js';
import { type PolicyEngineIdlType } from '../programs/types';

/** Program address for the policy engine program. */
export const policyRegistryProgramId = new PublicKey('po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau');

/**
 * Returns the policy engine program as a typed anchor program.
 * @param provider - Solana anchor provider.
 * @returns Typed solana program to be used for transaction building.
 */

export const getPolicyEngineProgram = (provider: Provider) => new Program(
	PolicyEngineIdl as Idl,
	policyRegistryProgramId,
	provider,
) as unknown as Program<PolicyEngineIdlType>;

/**
 * Retrieves the policy engine pda account for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The policy engines pda.
 */
export const getPolicyEnginePda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	policyRegistryProgramId,
)[0];
