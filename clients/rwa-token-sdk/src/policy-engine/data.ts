import { type AnchorProvider } from "@coral-xyz/anchor";
import { type PolicyEngineAccount, type PolicyAccount } from "./types";
import { getPolicyAccountPda, getPolicyEnginePda, getPolicyEngineProgram } from "./utils";

/**
 * Retrieves policy engine account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to {@link PolicyEngineAccount}, or `undefined` if it doesn't exist.
 */
export async function getPolicyEngineAccount(assetMint: string, provider: AnchorProvider): Promise<PolicyEngineAccount | undefined> {
	const policyEngineProgram = getPolicyEngineProgram(provider);
	const policyEnginePda = getPolicyEnginePda(assetMint);
	return policyEngineProgram.account.policyEngineAccount.fetch(policyEnginePda)
		.then(account => account)
		.catch(() => undefined);
}

/**
 * Retrieves the policy engine account for a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to an array of {@link PolicyAccount}, or `undefined` if undefined doesn't exist.
 */
export async function getPolicyAccount(assetMint: string, provider: AnchorProvider): Promise<PolicyAccount | undefined> {
	const policyEngineProgram = getPolicyEngineProgram(provider);
	const policyAccountPda = getPolicyAccountPda(assetMint);
	return policyEngineProgram.account.policyAccount.fetch(policyAccountPda);
}
