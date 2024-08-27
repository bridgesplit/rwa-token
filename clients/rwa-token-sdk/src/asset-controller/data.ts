import { type AnchorProvider } from "@coral-xyz/anchor";
import { type AssetControllerAccount } from "./types";
import {
	getAssetControllerPda,
	getAssetControllerProgram,
} from "./utils";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";

/**
 * Retrieves a asset controller account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to the fetched asset controller account, or `undefined` if it doesn't exist.
 */
export async function getAssetControllerAccount(
	assetMint: string,
	provider: AnchorProvider
): Promise<AssetControllerAccount | undefined> {
	const assetProgram = getAssetControllerProgram(provider);
	const assetControllerPda = getAssetControllerPda(assetMint);
	return assetProgram.account.assetControllerAccount
		.fetch(assetControllerPda)
		.then((account) => account)
		.catch(() => undefined);
}

export interface AssetControllerDataFilter {
	assetMint?: string;
	authority?: string;
	delegate?: string;
	owner?: string;
}

export const ASSET_CONTROLLER_ASSET_MINT_OFFSET = 9;
export const ASSET_CONTROLLER_AUTHORITY_OFFSET = 41;
export const ASSET_CONTROLLER_DELEGATE_OFFSET = 73;

/**
 * Retrieves a asset controller account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to the fetched asset controller account, or `undefined` if it doesn't exist.
 */
export async function getAssetControllerAccountsWithFilter(
	filter: Omit<AssetControllerDataFilter, "owner">,
	provider: AnchorProvider
): Promise<AssetControllerAccount[] | undefined> {
	const { assetMint, authority, delegate } = filter;
	const assetProgram = getAssetControllerProgram(provider);
	const filters: GetProgramAccountsFilter[] = [];
	if (assetMint) {
		filters.push({ memcmp: { offset: ASSET_CONTROLLER_ASSET_MINT_OFFSET, bytes: new PublicKey(assetMint).toBase58() } });
	}
	if (authority) {
		filters.push({ memcmp: { offset: ASSET_CONTROLLER_AUTHORITY_OFFSET, bytes: new PublicKey(authority).toBase58() } });
	}
	if (delegate) {
		filters.push({ memcmp: { offset: ASSET_CONTROLLER_DELEGATE_OFFSET, bytes: new PublicKey(delegate).toBase58() } });
	}
	const assetAccounts = await provider.connection.getProgramAccounts(assetProgram.programId, {
		filters,
	});
	return assetAccounts.map((account) =>
		assetProgram.coder.accounts.decode("AssetControllerAccount", account.account.data)
	);
}