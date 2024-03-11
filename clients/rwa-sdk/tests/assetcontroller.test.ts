/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BN, Wallet } from '@coral-xyz/anchor';
import {
	AttachPolicyArgs,
	CreateDataAccountArgs,
	getAssetControllerPda,
	getDataAccounts,
	getDataRegistryPda,
	getIdentityAccountPda,
	getIdentityRegistryPda,
	getPolicyEnginePda,
	getTrackerAccount, getTrackerAccountPda, IssueTokenArgs, SetupUserArgs, TransferTokensArgs, UpdateDataAccountArgs, VoidTokensArgs,
} from '../src';
import { setupTests } from './setup';
import { Commitment, ConfirmOptions, Connection, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { expect, test, describe } from 'vitest';
import { Config } from '../src/classes/types';
import { RwaClient } from '../src/classes/rwa';

describe('e2e class tests', () => {
	let rwaClient: RwaClient
	let mint: string;
	const setup = setupTests();

	const decimals = 2;
	const remainingAccounts: string[] = [];
	let dataAccount: string

	test('setup provider', async () => {
		const connectionUrl = process.env.RPC_URL ?? 'http://localhost:8899';
		const connection = new Connection(connectionUrl);

		const confirmationOptions: ConfirmOptions = {
			skipPreflight: false,
			maxRetries: 3,
			commitment: 'processed'
		}

		const config: Config = {
			connection: connection,
			rpcUrl: connectionUrl,
			confirmationOptions: confirmationOptions
		}

		rwaClient = new RwaClient(config, new Wallet(setup.payerKp))

		await rwaClient.provider.connection.confirmTransaction(
			await rwaClient.provider.connection.requestAirdrop(setup.payerKp.publicKey, 1000000000),
		);
		await rwaClient.provider.connection.confirmTransaction(
			await rwaClient.provider.connection.requestAirdrop(setup.authorityKp.publicKey, 1000000000),
		);
		await rwaClient.provider.connection.confirmTransaction(
			await rwaClient.provider.connection.requestAirdrop(setup.delegateKp.publicKey, 1000000000),
		);


		//start here


	});

	test('initalize asset controller through class', async () => {
		const SetupAssetControllerArgs = {
			decimals,
			payer: setup.payer.toString(),
			authority: setup.authority.toString(),
			name: 'Test Class Asset',
			uri: 'https://test.com',
			symbol: 'TFT'
		};

		const setupIx = await rwaClient.assetController.setUpNewRegistry(SetupAssetControllerArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(...setupIx.ixs), [setup.payerKp, ...setupIx.signers]);
		mint = setupIx.signers[0].publicKey.toString();
		expect(txnId).toBeTruthy();

		console.log('mint: ', mint);
		console.log('data registry: ', getDataRegistryPda(mint).toString());
		console.log('asset controller: ', getAssetControllerPda(mint).toString());
		console.log('policy engine: ', getPolicyEnginePda(mint).toString());
		console.log('identity registry: ', getIdentityRegistryPda(mint).toString());
	});

	test('setup data account through class', async t => {
		const createDataAccountArgs: CreateDataAccountArgs = {
			type: { legal: {} },
			name: 'Test Data Account',
			uri: 'https://test.com',
			payer: setup.payer.toString(),
			assetMint: mint
		}
		const createDataAccountIx = await rwaClient.dataRegistry.setupDataAccount(createDataAccountArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(...createDataAccountIx.ixs), [setup.payerKp, createDataAccountIx.signers[0]]);
		expect(txnId).toBeTruthy();
		dataAccount = createDataAccountIx.signers[0].publicKey.toString()
		console.log('data account: ', createDataAccountIx.signers[0].publicKey.toString());

	});


	test('attach identity approval policy through class', async () => {
		const policyArgs: AttachPolicyArgs = {
			authority: setup.authority.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			payer: setup.payer.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policy: {
				identityApproval: {},
			},
		};

		const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		remainingAccounts.push(policyIx.signers[0].publicKey.toString());
		expect(txnId).toBeTruthy();
		console.log('identity approval policy: ', policyIx.signers[0].publicKey.toString());
	})

	test('attach transaction amount limit policy through class', async () => {
		const policyArgs: AttachPolicyArgs = {
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policy: {
				transactionAmountLimit: {
					limit: new BN(100),
				},
			},
		}

		const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		remainingAccounts.push(policyIx.signers[0].publicKey.toString());
		expect(txnId).toBeTruthy();
		console.log('transaction amount limit policy: ', policyIx.signers[0].publicKey.toString());

	})
	test('attach transaction amount velocity policy class', async () => {
		const policyArgs: AttachPolicyArgs = {
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policy: {
				transactionAmountVelocity: {
					limit: new BN(100000),
					timeframe: new BN(60),
				},
			},
		}

		const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		remainingAccounts.push(policyIx.signers[0].publicKey.toString());
		expect(txnId).toBeTruthy();
		console.log('transaction amount velocity policy: ', policyIx.signers[0].publicKey.toString());

	})
	test('attach transaction count velocity policy', async () => {
		const policyArgs: AttachPolicyArgs = {
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policy: {
				transactionCountVelocity: {
					limit: new BN(100),
					timeframe: new BN(60),
				},
			},
		}

		const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		expect(txnId).toBeTruthy();
		console.log('transaction count velocity policy: ', policyIx.signers[0].publicKey.toString());

	})


	test('setup a user through class', async () => {
		const setupUserArgs: SetupUserArgs = {
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			level: 1,
		}
		const setupIx = await rwaClient.identityRegistry.setupUserIxns(setupUserArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(...setupIx.ixs), [setup.payerKp, ...setupIx.signers]);
		expect(txnId).toBeTruthy();
		const trackerAccount = await getTrackerAccount(mint, setup.authority.toString(), rwaClient.provider);
		expect(trackerAccount).toBeTruthy();
		expect(trackerAccount!.assetMint.toString()).toBe(mint);
		console.log('tracker account: ', getTrackerAccountPda(mint, setup.authority.toString()).toString());
		console.log('identity account: ', getIdentityAccountPda(mint, setup.authority.toString()).toString());
	})

	test('issue tokens through class', async () => {
		const issueArgs: IssueTokenArgs = {
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			amount: 1000000,
		}
		const issueIx = await rwaClient.assetController.issueTokenIxns(issueArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(issueIx), [setup.payerKp]);
		expect(txnId).toBeTruthy();
		console.log('issue tokens signature: ', txnId)
	})


	test('update data account through class', async t => {
		const updateDataAccountArgs: UpdateDataAccountArgs = {
			dataAccount: dataAccount,
			name: 'Example Token Updatse',
			uri: 'newUri',
			type: { tax: {} },
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
		}
		const updateDataIx = await rwaClient.dataRegistry.updateAssetsDataAccountInfoIxns(updateDataAccountArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(updateDataIx), [setup.payerKp, setup.authorityKp]);
		expect(txnId).toBeTruthy();
		console.log('update data account signature: ', txnId)

	});

	test('transfer tokens through class', async () => {
		const transferArgs: TransferTokensArgs = {
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			from: setup.authority.toString(),
			to: setup.authority.toString(),
			assetMint: mint,
			amount: 2000,
			remainingAccounts,
			decimals,
		}

		const transferIx = await rwaClient.assetController.transfer(transferArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(transferIx), [setup.payerKp]);
		expect(txnId).toBeTruthy();
	})

	test('revoke tokens through class', async () => {
		const voidArgs: VoidTokensArgs = {
			payer: setup.payer.toString(),
			amount: 100,
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
		}
		const voidIx = await rwaClient.assetController.voidTokenIxns(voidArgs)
		const txnId = await sendAndConfirmTransaction(rwaClient.provider.connection, new Transaction().add(voidIx), [setup.payerKp, setup.authorityKp]);
		expect(txnId).toBeTruthy();
		console.log('revoke tokens signature: ', txnId)
	})
});
