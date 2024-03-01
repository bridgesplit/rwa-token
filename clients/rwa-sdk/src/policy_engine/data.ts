import {getProvider} from '../utils';
import {type PolicyEngineAccount, type PolicyAccount} from './types';
import {getPolicyEnginePda, getPolicyEngineProgram} from './utils';

export async function getPolicyEngineAccount(assetMint: string): Promise<PolicyEngineAccount | undefined> {
	const provider = getProvider();
	const policyEngineProgram = getPolicyEngineProgram(provider);
	const policyEnginePda = getPolicyEnginePda(assetMint);
	return policyEngineProgram.account.policyEngineAccount.fetch(policyEnginePda)
		.then(account => account)
		.catch(() => undefined);
}

export async function getPolicyAccounts(assetMint: string): Promise<PolicyAccount[] | undefined> {
	const provider = getProvider();
	const policyEngineProgram = getPolicyEngineProgram(provider);
	const policyEnginePda = getPolicyEnginePda(assetMint);
	const policyAccounts = await provider.connection.getProgramAccounts(policyEngineProgram.programId, {
		filters:
            [{memcmp: {offset: 9, bytes: policyEnginePda.toBase58()}}],
	});
	return policyAccounts.map(account => policyEngineProgram.coder.accounts.decode('PolicyAccount', account.account.data));
}
