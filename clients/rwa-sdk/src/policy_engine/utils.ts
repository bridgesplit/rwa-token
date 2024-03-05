import { type Idl, Program, type Provider } from '@coral-xyz/anchor';
import { PolicyEngineIdl } from '../programs/idls';
import { PublicKey } from '@solana/web3.js';
import { type PolicyEngine } from '../programs/types';

/** Program address for the policy engine program. */
export const policyRegistryProgramId = new PublicKey('6FcM5R2KcdUGcdLunzLm3XLRFr7FiF6Hdz3EWni8YPa2');

/**
 * Returns the policy engine program as a typed anchor program.
 * @param provider - Solana anchor provider.
 * @returns Typed solana program to be used for transaction building.
 */
export const getPolicyEngineProgram = (provider: Provider) => new Program(
	PolicyEngineIdl as Idl,
	policyRegistryProgramId,
	provider,
) as unknown as Program<PolicyEngine>;

/**
 * Retrieves the policy engine pda account for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The policy engines pda.
 */
export const getPolicyEnginePda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	policyRegistryProgramId,
)[0];
