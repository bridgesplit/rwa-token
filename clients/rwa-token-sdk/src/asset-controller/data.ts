import { type AnchorProvider } from "@coral-xyz/anchor";
import { type AssetControllerAccount, type TrackerAccount } from "./types";
import {
	getAssetControllerPda,
	getAssetControllerProgram,
	getTrackerAccountPda,
} from "./utils";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { getPolicyAccount, getPolicyEngineAccount, PolicyAccount, PolicyEngineAccount } from "../policy-engine";
import { DataAccount, DataRegistryAccount, getDataAccountsWithFilter, getDataRegistryAccount } from "../data-registry";
import { getIdentityAccount, getIdentityRegistryAccount, IdentityAccount, IdentityRegistryAccount } from "../identity-registry";

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

/**
 * Retrieves a tracker account pda associated with a specific asset mint and owner.
 * @param assetMint - The string representation of the asset mint.
 * @param owner - The string representation of the owner's public key.
 * @returns A promise resolving to the fetched tracker account, or `undefined` if it doesn't exist.
 */
export async function getTrackerAccount(
	assetMint: string,
	owner: string,
	provider: AnchorProvider
): Promise<TrackerAccount | undefined> {
	const assetProgram = getAssetControllerProgram(provider);
	const trackerPda = getTrackerAccountPda(assetMint, owner);
	return assetProgram.account.trackerAccount
		.fetch(trackerPda)
		.then((account) => account)
		.catch(() => undefined);
}

export const TRACKER_ACCOUNT_ASSET_MINT_OFFSET = 9;
export const TRACKER_ACCOUNT_OWNER_OFFSET = 41;

/**
 * Retrieves all tracker accounts associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to the fetched tracker accounts, or `undefined` if it doesn't exist.
 */
export async function getTrackerAccountsWithFilter(
	filter: Omit<AssetControllerDataFilter, "authority" | "delegate">,
	provider: AnchorProvider
): Promise<TrackerAccount[] | undefined> {
	const { assetMint, owner } = filter;
	const assetProgram = getAssetControllerProgram(provider);
	const filters: GetProgramAccountsFilter[] = [];
	if (assetMint) {
		filters.push({ memcmp: { offset: TRACKER_ACCOUNT_ASSET_MINT_OFFSET, bytes: new PublicKey(assetMint).toBase58() } });
	}
	if (owner) {
		filters.push({ memcmp: { offset: TRACKER_ACCOUNT_OWNER_OFFSET, bytes: new PublicKey(owner).toBase58() } });
	}
	const trackerAccounts = await provider.connection.getProgramAccounts(assetProgram.programId, {
		filters,
	});
	return trackerAccounts.map((account) =>
		assetProgram.coder.accounts.decode("TrackerAccount", account.account.data)
	);
}

export interface RwaAccounts {
	assetMint: string;
	assetController?: AssetControllerAccount;
	tracker?: TrackerAccount;
	policyEngine?: PolicyEngineAccount;
	policyAccount?: PolicyAccount;
	dataRegistry?: DataRegistryAccount;
	dataAccounts?: DataAccount[];
	identityRegistry?: IdentityRegistryAccount;
	identity?: IdentityAccount;
}


/**
 * Retrieves all RWA accounts associated with a specific asset mint.
 * @param assetMints - The string representation of the asset mint.
 * @returns A promise resolving to the fetched RWA accounts, or `undefined` if it doesn't exist.
 */
export async function getRwaAccountsWithMints(
	assetMints: string[],
	provider: AnchorProvider,
	owner?: string,
): Promise<RwaAccounts[]> {
	const accounts: RwaAccounts[] = [];
	for (const assetMint of assetMints) {
		const assetController = getAssetControllerAccount(assetMint, provider);
		const tracker = owner ? getTrackerAccount(assetMint, owner, provider) : undefined;
		const policyEngine = getPolicyEngineAccount(assetMint, provider);
		const policyAccount = getPolicyAccount(assetMint, provider);
		const dataRegistry = getDataRegistryAccount(assetMint, provider);
		const dataAccounts = getDataAccountsWithFilter({ assetMint }, provider);
		const identityRegistry = getIdentityRegistryAccount(assetMint, provider);
		const identity = owner ? getIdentityAccount(assetMint, owner, provider) : undefined;

		const [resolvedAssetController, resolvedTracker, resolvedPolicyEngine, resolvedPolicyAccount, resolvedDataRegistry, resolvedDataAccounts, resolvedIdentityRegistry, resolvedIdentity] = await Promise.all([
			assetController,
			tracker,
			policyEngine,
			policyAccount,
			dataRegistry,
			dataAccounts,
			identityRegistry,
			identity
		]);

		accounts.push({
			assetMint,
			assetController: resolvedAssetController,
			tracker: resolvedTracker,
			policyEngine: resolvedPolicyEngine,
			policyAccount: resolvedPolicyAccount,
			dataRegistry: resolvedDataRegistry,
			dataAccounts: resolvedDataAccounts,
			identityRegistry: resolvedIdentityRegistry,
			identity: resolvedIdentity,
		});
	}
	return accounts;
}