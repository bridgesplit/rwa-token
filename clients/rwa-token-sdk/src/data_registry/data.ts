import {getProvider} from '../utils';
import {type DataRegistryAccount, type DataAccount} from './types';
import {getDataRegistryPda, getDataRegistryProgram} from './utils';

export async function getDataRegistryAccount(assetMint: string): Promise<DataRegistryAccount | undefined> {
	const provider = getProvider();
	const dataRegistryProgram = getDataRegistryProgram(provider);
	const dataRegistryPda = getDataRegistryPda(assetMint);
	return dataRegistryProgram.account.dataRegistryAccount.fetch(dataRegistryPda)
		.then(account => account)
		.catch(() => undefined);
}

export async function getDataAccounts(assetMint: string): Promise<DataAccount[] | undefined> {
	const provider = getProvider();
	const dataRegistryProgram = getDataRegistryProgram(provider);
	const dataRegistryPda = getDataRegistryPda(assetMint);
	const dataAccounts = await provider.connection.getProgramAccounts(dataRegistryProgram.programId, {
		filters:
            [{memcmp: {offset: 9, bytes: dataRegistryPda.toBase58()}}],
	});
	return dataAccounts.map(account => dataRegistryProgram.coder.accounts.decode('DataAccount', account.account.data));
}
