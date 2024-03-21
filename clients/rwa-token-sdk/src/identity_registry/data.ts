import {getProvider} from '../utils';
import {type IdentityRegistryAccount, type IdentityAccount} from './types';
import {getIdentityAccountPda, getIdentityRegistryPda, getIdentityRegistryProgram} from './utils';

export async function getIdentityRegistryAccount(assetMint: string): Promise<IdentityRegistryAccount | undefined> {
	const provider = getProvider();
	const identityRegistryProgram = getIdentityRegistryProgram(provider);
	const identityRegistryPda = getIdentityRegistryPda(assetMint);
	return identityRegistryProgram.account.identityRegistryAccount.fetch(identityRegistryPda)
		.then(account => account)
		.catch(() => undefined);
}

export async function getIdentityAccount(assetMint: string, owner: string): Promise<IdentityAccount | undefined> {
	const provider = getProvider();
	const identityRegistryProgram = getIdentityRegistryProgram(provider);
	const identityAccountPda = getIdentityAccountPda(assetMint, owner);
	return identityRegistryProgram.account.identityAccount.fetch(identityAccountPda)
		.then(account => account)
		.catch(() => undefined);
}
