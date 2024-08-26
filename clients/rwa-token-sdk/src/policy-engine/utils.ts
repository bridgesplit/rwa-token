import { type Idl, Program, type Provider, utils } from "@coral-xyz/anchor";
import { PolicyEngineIdl } from "../programs/idls";
import { PublicKey } from "@solana/web3.js";
import { type PolicyEngineIdlTypes } from "../programs/types";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

/** Program address for the policy engine program. */
export const policyEngineProgramId = new PublicKey(
	"po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau"
);

/**
 * Returns the policy engine program as a typed anchor program.
 * @param provider - Solana anchor provider.
 * @returns Typed solana program to be used for transaction building.
 */

export const getPolicyEngineProgram = (provider: Provider) =>
  new Program(
    PolicyEngineIdl as Idl,
    provider
  ) as unknown as Program<PolicyEngineIdlTypes>;

/**
 * Retrieves the policy engine pda account for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The policy engines pda.
 */
export const getPolicyEnginePda = (assetMint: string) =>
	PublicKey.findProgramAddressSync(
		[new PublicKey(assetMint).toBuffer()],
		policyEngineProgramId
	)[0];

/**
 * Retrieves the policy account pda for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The policy accounts pda.
 */
export const getPolicyAccountPda = (assetMint: string) =>
	PublicKey.findProgramAddressSync(
		[getPolicyEnginePda(assetMint).toBuffer()],
		policyEngineProgramId
	)[0];

/**
 * Retrieves the tracker pda for a specific asset controller mint and owner.
 * @param assetMint - The string representation of the asset's mint address.
 * @param owner - The string representation of asset's owner.
 * @returns The asset controller's tracker pda.
 */
export const getTrackerAccountPda = (assetMint: string, owner: string) =>
	PublicKey.findProgramAddressSync(
		[new PublicKey(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
		policyEngineProgramId
	)[0];

export const getPolicyEnginerEventAuthority = () => PublicKey.findProgramAddressSync(
	[utils.bytes.utf8.encode("__event_authority")],
	policyEngineProgramId
)[0];


/**
 * Retrieves the asset controller's metadata pda account for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The asset controller's extra metadata pda.
 */
export const getExtraMetasListPda = (assetMint: string) =>
	PublicKey.findProgramAddressSync(
		[utf8.encode("extra-account-metas"), new PublicKey(assetMint).toBuffer()],
		policyEngineProgramId
	)[0];

