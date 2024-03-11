import { AnchorProvider } from '@coral-xyz/anchor';
import { type DataRegistryAccount, type DataAccount } from './types';
import { getDataRegistryPda, getDataRegistryProgram } from './utils';

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

/**
 * Retrieves all data accounts associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to an array of {@link DataAccount}, or `undefined` if it doesn't exist.
 */
export async function getDataAccounts(assetMint: string, provider: AnchorProvider): Promise<DataAccount[] | undefined> {
	const dataRegistryProgram = getDataRegistryProgram(provider);
	const dataRegistryPda = getDataRegistryPda(assetMint);
	const dataAccounts = await provider.connection.getProgramAccounts(dataRegistryProgram.programId, {
		filters:
			[{ memcmp: { offset: 9, bytes: dataRegistryPda.toBase58() } }],
	});
	return dataAccounts.map(account => dataRegistryProgram.coder.accounts.decode('DataAccount', account.account.data));
}
