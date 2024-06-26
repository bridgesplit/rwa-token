import { type AnchorProvider } from "@coral-xyz/anchor";
import { type PolicyEngineAccount, type PolicyAccount } from "./types";
import { getPolicyAccountPda, getPolicyEnginePda, getPolicyEngineProgram } from "./utils";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";

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

export interface PolicyEngineFilter {
	assetMint?: string;
	authority?: string;
	delegate?: string;
}

export const POLICY_ENGINE_ASSET_MINT_OFFSET = 9;
export const POLICY_ENGINE_AUTHORITY_OFFSET = 41;
export const POLICY_ENGINE_DELEGATE_OFFSET = 73;

/**
 * Retrieves policy engine accounts with a filter.
 * @param filter - The filter to apply to the policy engine accounts.
 * @returns A promise resolving to an array of {@link PolicyEngineAccount}, or `undefined` if it doesn't exist.
 */
export async function getPolicyEngineAccountsWithFilter(filter: PolicyEngineFilter, provider: AnchorProvider): Promise<PolicyEngineAccount[] | undefined> {
	const { assetMint, authority, delegate } = filter;
	const policyEngineProgram = getPolicyEngineProgram(provider);
	const filters: GetProgramAccountsFilter[] = [];
	if (assetMint) {
		filters.push({ memcmp: { offset: POLICY_ENGINE_ASSET_MINT_OFFSET, bytes: new PublicKey(assetMint).toBase58() } });
	}
	if (authority) {
		filters.push({ memcmp: { offset: POLICY_ENGINE_AUTHORITY_OFFSET, bytes: new PublicKey(authority).toBase58() } });
	}
	if (delegate) {
		filters.push({ memcmp: { offset: POLICY_ENGINE_DELEGATE_OFFSET, bytes: new PublicKey(delegate).toBase58() } });
	}
	const policyAccounts = await provider.connection.getProgramAccounts(policyEngineProgram.programId, {
		filters,
	});
	return policyAccounts.map(account => policyEngineProgram.coder.accounts.decode("PolicyEngineAccount", account.account.data));
}

/**
 * Retrieves a policy account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to the fetched policy account, or `undefined` if it doesn't exist.
 */
export async function getPolicyAccount(assetMint: string, provider: AnchorProvider): Promise<PolicyAccount | undefined> {
	const policyEngineProgram = getPolicyEngineProgram(provider);
	const policyAccountPda = getPolicyAccountPda(assetMint);
	return policyEngineProgram.account.policyAccount.fetch(policyAccountPda);
}