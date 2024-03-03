import {getProvider} from '../utils';
import {type AssetControllerAccount, type TrackerAccount} from './types';
import {getAssetControllerPda, getAssetControllerProgram, getTrackerAccountPda} from './utils';

export async function getAssetControllerAccount(assetMint: string): Promise<AssetControllerAccount | undefined> {
	const provider = getProvider();
	const assetProgram = getAssetControllerProgram(provider);
	const assetControllerPda = getAssetControllerPda(assetMint);
	return assetProgram.account.assetControllerAccount.fetch(assetControllerPda)
		.then(account => account)
		.catch(() => undefined);
}

export async function getTrackerAccount(assetMint: string, owner: string): Promise<TrackerAccount | undefined> {
	const provider = getProvider();
	const assetProgram = getAssetControllerProgram(provider);
	const trackerPda = getTrackerAccountPda(assetMint, owner);
	return assetProgram.account.trackerAccount.fetch(trackerPda)
		.then(account => account)
		.catch(() => undefined);
}
