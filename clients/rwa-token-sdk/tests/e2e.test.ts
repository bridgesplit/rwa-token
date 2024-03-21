
// Import {BN} from '@coral-xyz/anchor';
// import {
// 	getAssetControllerPda,
// 	getAttachToPolicyAccountIx,
// 	getCreateDataAccountIx, getCreatePolicAccountIx, getDataRegistryPda, getIdentityAccountPda, getIdentityRegistryPda, getIssueTokensIx, getPolicyEnginePda, getSetupAssetControllerIxs, getSetupUserIxs, getTrackerAccount, getTrackerAccountPda, getTransferTokensIx, Policy,
// } from '../src';
// import {setupTests} from './setup';
// import {PublicKey, Transaction, sendAndConfirmTransaction} from '@solana/web3.js';
// import {expect, test, describe} from 'vitest';
// import {createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID} from '@solana/spl-token';

// describe('e2e tests', () => {
// 	let mint: string;
// 	const setup = setupTests();
// 	const decimals = 2;
// 	const remainingAccounts: string[] = [];

// 	test('setup provider', async () => {
// 		await setup.provider.connection.confirmTransaction(
// 			await setup.provider.connection.requestAirdrop(setup.payerKp.publicKey, 1000000000),
// 		);
// 		await setup.provider.connection.confirmTransaction(
// 			await setup.provider.connection.requestAirdrop(setup.authorityKp.publicKey, 1000000000),
// 		);
// 		// Await setup.provider.connection.confirmTransaction(
// 		// 	await setup.provider.connection.requestAirdrop(setup.user2, 1000000000),
// 		// );
// 	});

// 	test('setup registries', async () => {
// 		const createAssetControllerArgs = {
// 			decimals,
// 			payer: setup.payer.toString(),
// 			authority: setup.authority.toString(),
// 			name: 'Test Asset',
// 			uri: 'https://test.com',
// 			symbol: 'TST',
// 		};
// 		const setupAssetController = await getSetupAssetControllerIxs(
// 			createAssetControllerArgs,
// 		);
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupAssetController.ixs), [setup.payerKp, ...setupAssetController.signers]);
// 		mint = setupAssetController.signers[0].publicKey.toString();
// 		console.log('mint: ', mint);
// 		console.log('data registry: ', getDataRegistryPda(mint).toString());
// 		console.log('asset controller: ', getAssetControllerPda(mint).toString());
// 		console.log('policy engine: ', getPolicyEnginePda(mint).toString());
// 		console.log('identity registry: ', getIdentityRegistryPda(mint).toString());
// 		expect(txnId).toBeTruthy();
// 	});

// 	test('create data account', async t => {
// 		const createDataAccountIx = await getCreateDataAccountIx({
// 			type: {legal: {}},
// 			name: 'Test Data Account',
// 			uri: 'https://test.com',
// 			payer: setup.payer.toString(),
// 			assetMint: mint,
// 		});
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...createDataAccountIx.ixs), [setup.payerKp, createDataAccountIx.signers[0]]);
// 		expect(txnId).toBeTruthy();
// 		console.log('data account: ', createDataAccountIx.signers[0].publicKey.toString());
// 	});

// 	test('create policy account and attach identity approval policy', async t => {
// 		const attachPolicy = await getCreatePolicAccountIx({
// 			payer: setup.payer.toString(),
// 			owner: setup.authority.toString(),
// 			assetMint: mint,
// 			authority: setup.authority.toString(),
// 			identityFilter: {
// 				identityLevels: [1],
// 				comparisionType: {or: {}},
// 			},
// 			policyType: {
// 				identityApproval: {},
// 			},
// 		});
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...attachPolicy.ixs), [setup.payerKp, ...attachPolicy.signers]);
// 		expect(txnId).toBeTruthy();
// 	});

// 	test('attach transaction amount limit policy', async t => {
// 		const attachPolicy = await getAttachToPolicyAccountIx({
// 			payer: setup.payer.toString(),
// 			owner: setup.authority.toString(),
// 			assetMint: mint,
// 			authority: setup.authority.toString(),
// 			identityFilter: {
// 				identityLevels: [1],
// 				comparisionType: {or: {}},
// 			},
// 			policyType: {
// 				transactionAmountLimit: {
// 					limit: new BN(100),
// 				},
// 			},
// 		});
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...attachPolicy.ixs), [setup.payerKp, ...attachPolicy.signers]);
// 		expect(txnId).toBeTruthy();
// 	});

// 	test('attach transaction amount velocity policy', async t => {
// 		const attachPolicy = await getAttachToPolicyAccountIx({
// 			payer: setup.payer.toString(),
// 			owner: setup.authority.toString(),
// 			assetMint: mint,
// 			authority: setup.authority.toString(),
// 			identityFilter: {
// 				identityLevels: [1],
// 				comparisionType: {or: {}},
// 			},
// 			policyType: {
// 				transactionAmountVelocity: {
// 					limit: new BN(100000),
// 					timeframe: new BN(60),
// 				},
// 			},
// 		});
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...attachPolicy.ixs), [setup.payerKp, ...attachPolicy.signers]);
// 		expect(txnId).toBeTruthy();
// 	});

// 	test('attach transaction count velocity policy', async t => {
// 		const attachPolicy = await getAttachToPolicyAccountIx({
// 			payer: setup.payer.toString(),
// 			owner: setup.authority.toString(),
// 			assetMint: mint,
// 			authority: setup.authority.toString(),
// 			identityFilter: {
// 				identityLevels: [1],
// 				comparisionType: {or: {}},
// 			},
// 			policyType: {
// 				transactionCountVelocity: {
// 					limit: new BN(100),
// 					timeframe: new BN(60),
// 				},
// 			},
// 		});
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...attachPolicy.ixs), [setup.payerKp, ...attachPolicy.signers]);
// 		expect(txnId).toBeTruthy();
// 	});

// 	test('setup user', async t => {
// 		const setupUser = await getSetupUserIxs({
// 			payer: setup.payer.toString(),
// 			owner: setup.authority.toString(),
// 			assetMint: mint,
// 			level: 1,
// 		});
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupUser.ixs), [setup.payerKp, ...setupUser.signers]);
// 		expect(txnId).toBeTruthy();
// 		const trackerAccount = await getTrackerAccount(mint, setup.authority.toString());
// 		expect(trackerAccount).toBeTruthy();
// 		expect(trackerAccount!.assetMint.toString()).toBe(mint);
// 		console.log('tracker account: ', getTrackerAccountPda(mint, setup.authority.toString()).toString());
// 		console.log('identity account: ', getIdentityAccountPda(mint, setup.authority.toString()).toString());
// 	});

// 	test('issue tokens', async t => {
// 		const issueTokens = await getIssueTokensIx({
// 			authority: setup.authority.toString(),
// 			payer: setup.payer.toString(),
// 			owner: setup.authority.toString(),
// 			assetMint: mint,
// 			amount: 1000000,
// 		});
// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(issueTokens), [setup.payerKp]);
// 		expect(txnId).toBeTruthy();
// 	});

// 	test('transfer tokens', async t => {
// 		const setupTa = createAssociatedTokenAccountInstruction(setup.payer, getAssociatedTokenAddressSync(new PublicKey(mint), setup.user2, undefined, TOKEN_2022_PROGRAM_ID), setup.user2, new PublicKey(mint), TOKEN_2022_PROGRAM_ID);
// 		const transferTokensIx = await getTransferTokensIx({
// 			authority: setup.authority.toString(),
// 			payer: setup.payer.toString(),
// 			from: setup.authority.toString(),
// 			to: setup.user2.toString(),
// 			assetMint: mint,
// 			amount: 1,
// 			remainingAccounts,
// 			decimals,
// 		});
// 		const txnId = await sendAndConfirmTransaction(
// 			setup.provider.connection,
// 			new Transaction().add(setupTa).add(transferTokensIx),
// 			[setup.payerKp],
// 		);
// 		expect(txnId).toBeTruthy();
// 	});
// });
