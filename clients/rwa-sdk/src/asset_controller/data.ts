import {type AnchorProvider} from '@coral-xyz/anchor';
import {type AssetControllerAccount, type TrackerAccount} from './types';
import {getAssetControllerPda, getAssetControllerProgram, getTrackerAccountPda} from './utils';

/**
 * Retrieves a asset controller account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to the fetched asset controller account, or `undefined` if it doesn't exist.
 */
export async function getAssetControllerAccount(assetMint: string, provider: AnchorProvider): Promise<AssetControllerAccount | undefined> {
	const assetProgram = getAssetControllerProgram(provider);
	const assetControllerPda = getAssetControllerPda(assetMint);
	return assetProgram.account.assetControllerAccount.fetch(assetControllerPda)
		.then(account => account)
		.catch(() => undefined);
}

/**
 * Retrieves a tracker account pda associated with a specific asset mint and owner.
 * @param assetMint - The string representation of the asset mint.
 * @param owner - The string representation of the owner's public key.
 * @returns A promise resolving to the fetched tracker account, or `undefined` if it doesn't exist.
 */
export async function getTrackerAccount(assetMint: string, owner: string, provider: AnchorProvider): Promise<TrackerAccount | undefined> {
	const assetProgram = getAssetControllerProgram(provider);
	const trackerPda = getTrackerAccountPda(assetMint, owner);
	return assetProgram.account.trackerAccount.fetch(trackerPda)
		.then(account => account)
		.catch(() => undefined);
}
