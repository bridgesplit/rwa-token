import { type AnchorProvider } from "@coral-xyz/anchor";
import { type DataRegistryAccount, type DataAccount } from "./types";
import { getDataRegistryPda, getDataRegistryProgram } from "./utils";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";

/**
 * Retrieves data registry account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to the fetched data registry account, or `undefined` if it doesn't exist.
 */
export async function getDataRegistryAccount(assetMint: string, provider: AnchorProvider): Promise<DataRegistryAccount | undefined> {
	const dataRegistryProgram = getDataRegistryProgram(provider);
	const dataRegistryPda = getDataRegistryPda(assetMint);
	return dataRegistryProgram.account.dataRegistryAccount.fetch(dataRegistryPda)
		.then(account => account)
		.catch(() => undefined);
}

export interface DataRegistryFilter {
	assetMint?: string;
	authority?: string;
	delegate?: string;
}

export const DATA_REGISTRY_ASSET_MINT_OFFSET = 9;
export const DATA_REGISTRY_AUTHORITY_OFFSET = 41;
export const DATA_REGISTRY_DELEGATE_OFFSET = 73;

/**
 * Retrieves data registry account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to the fetched data registry account, or `undefined` if it doesn't exist.
 */
export async function getDataRegistryAccountsWithFilter(
	filter: DataRegistryFilter,
	provider: AnchorProvider
): Promise<DataRegistryAccount[] | undefined> {
	const { assetMint, authority, delegate } = filter;
	const dataRegistryProgram = getDataRegistryProgram(provider);
	const filters: GetProgramAccountsFilter[] = [];
	if (assetMint) {
		filters.push({ memcmp: { offset: DATA_REGISTRY_ASSET_MINT_OFFSET, bytes: new PublicKey(assetMint).toBase58() } });
	}
	if (authority) {
		filters.push({ memcmp: { offset: DATA_REGISTRY_AUTHORITY_OFFSET, bytes: new PublicKey(authority).toBase58() } });
	}
	if (delegate) {
		filters.push({ memcmp: { offset: DATA_REGISTRY_DELEGATE_OFFSET, bytes: new PublicKey(delegate).toBase58() } });
	}
	const dataAccounts = await provider.connection.getProgramAccounts(dataRegistryProgram.programId, {
		filters,
	});
	return dataAccounts.map(account => dataRegistryProgram.coder.accounts.decode("DataRegistryAccount", account.account.data));
}

export interface DataAccountFilter {
	assetMint?: string;
	registry?: string;
	type?: string;
}

export const DATA_ACCOUNT_REGISTRY_OFFSET = 9;
export const DATA_ACCOUNT_TYPE_OFFSET = 41;

/**
 * Retrieves all data accounts associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to an array of {@link DataAccount}, or `undefined` if it doesn't exist.
 */
export async function getDataAccountsWithFilter(filter: DataAccountFilter, provider: AnchorProvider): Promise<DataAccount[] | undefined> {
	const { assetMint, registry, type } = filter;
	const dataRegistryProgram = getDataRegistryProgram(provider);
	const filters: GetProgramAccountsFilter[] = [];
	if (assetMint) {
		const dataRegistryPda = getDataRegistryPda(assetMint);
		filters.push({ memcmp: { offset: DATA_ACCOUNT_REGISTRY_OFFSET, bytes: dataRegistryPda.toBase58() } });
	}
	if (registry) {
		filters.push({ memcmp: { offset: DATA_ACCOUNT_REGISTRY_OFFSET, bytes: new PublicKey(registry).toBase58() } });
	}
	if (type) {
		filters.push({ memcmp: { offset: DATA_ACCOUNT_TYPE_OFFSET, bytes: new PublicKey(type).toBase58() } });
	}
	const dataAccounts = await provider.connection.getProgramAccounts(dataRegistryProgram.programId, {
		filters,
	});
	return dataAccounts.map(account => dataRegistryProgram.coder.accounts.decode("DataAccount", account.account.data));
}