import {
	getAttachPolicyAccountIx, getSetupAssetControllerIxs, getSetupIssueTokensIxs, getSetupUserIxs, getTrackerAccount, getTransferTokensIx, Policy,
} from '../src';
import {setupTests} from './setup';
import {ComputeBudgetProgram, Transaction, sendAndConfirmTransaction} from '@solana/web3.js';
import {expect, test, describe} from 'vitest';

describe('e2e tests', () => {
	let mint: string;
	const setup = setupTests();
	const decimals = 2;
	const remainingAccounts: string[] = [];

	test('setup provider', async () => {
		await setup.provider.connection.confirmTransaction(
			await setup.provider.connection.requestAirdrop(setup.payerKp.publicKey, 1000000000),
		);
		await setup.provider.connection.confirmTransaction(
			await setup.provider.connection.requestAirdrop(setup.authorityKp.publicKey, 1000000000),
		);
		await setup.provider.connection.confirmTransaction(
			await setup.provider.connection.requestAirdrop(setup.delegateKp.publicKey, 1000000000),
		);
	});

	test('setup registries', async () => {
		const createAssetControllerArgs = {
			decimals,
			payer: setup.payer.toString(),
			authority: setup.authority.toString(),
		};
		const setupAssetController = await getSetupAssetControllerIxs(
			createAssetControllerArgs,
		);
		const feeIx = ComputeBudgetProgram.setComputeUnitPrice({
			microLamports: 10,
		});
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(feeIx).add(...setupAssetController.ixs), [setup.payerKp, ...setupAssetController.signers]);
		mint = setupAssetController.signers[0].publicKey.toString();
		expect(txnId).toBeTruthy();
	});

	test('attach identity approval policy', async t => {
		const attachPolicy = await getAttachPolicyAccountIx({
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: {or: {}},
			},
			policy: {
				identityApproval: {},
			},
		});
		const feeIx = ComputeBudgetProgram.setComputeUnitPrice({
			microLamports: 10,
		});
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(feeIx).add(...attachPolicy.ixs), [setup.payerKp, ...attachPolicy.signers]);
		remainingAccounts.push(attachPolicy.signers[0].publicKey.toString());
		expect(txnId).toBeTruthy();
	});

	test('setup user', async t => {
		const setupUser = await getSetupUserIxs({
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			level: 1,
		});
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupUser.ixs), [setup.payerKp, ...setupUser.signers]);
		expect(txnId).toBeTruthy();
		const trackerAccount = await getTrackerAccount(mint, setup.authority.toString());
		expect(trackerAccount).toBeTruthy();
		expect(trackerAccount!.assetMint.toString()).toBe(mint);
	});

	// Test('issue tokens', async (t) => {
	//     const issueTokens = await getSetupIssueTokensIxs({
	//         authority: setup.authority.toString(),
	//         payer: setup.payer.toString(),
	//         owner: setup.authority.toString(),
	//         assetMint: mint,
	//         amount: 10000
	//     })
	//     const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...issueTokens.ixs), [setup.payerKp, ...issueTokens.signers]);
	//     expect(txnId).toBeTruthy();;
	//     await setTimeout(() => { }, 5000);
	// });

	// test('transfer tokens', async (t) => {
	//     const transferTokensIx = await getTransferTokensIx({
	//         authority: setup.authority.toString(),
	//         payer: setup.payer.toString(),
	//         from: setup.authority.toString(),
	//         to: setup.authority.toString(),
	//         assetMint: mint,
	//         amount: 100,
	//         remainingAccounts,
	//         decimals,
	//     });
	//     const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(transferTokensIx), [setup.payerKp]);
	//     expect(txnId).toBeTruthy();;
	// });
});
