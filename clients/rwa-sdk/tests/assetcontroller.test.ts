/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BN } from '@coral-xyz/anchor';
import {
	AttachPolicyArgs,
	CreateDataAccountArgs,
	getDataAccounts,
	getTrackerAccount, IssueTokenArgs, SetupAssetControllerArgs, SetupUserArgs, TransferTokensArgs, UpdateDataAccountArgs, VoidTokensArgs,
} from '../src';
import { setupTests } from './setup';
import { Commitment, Connection, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { expect, test, describe } from 'vitest';
import { RwaConfig } from '../src/classes/types';
import { RwaClient } from '../src/classes/rwaclass';

describe('e2e class tests', () => {
	let rwaClient: RwaClient
	let mint: string;
	const setup = setupTests();
	const decimals = 2;
	const remainingAccounts: string[] = [];
	let dataAccount: string

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

		interface ConfirmationOptions {
			commitment?: Commitment;
			timeout?: number; // Timeout in milliseconds
		}

		const confirmationOptions: ConfirmationOptions = {
			commitment: 'recent',
			timeout: 30000 // 30 seconds timeout
		};

		const connection = new Connection('https://api.mainnet-beta.solana.com', {
			commitment: "finalized",
		});

		//start here
		const rwaConfig: RwaConfig = {
			connection: setup.provider.connection,
			rpcUrl: 'https://api.mainnet-beta.solana.com',
			confirmationOptions: confirmationOptions
		}
		rwaClient = new RwaClient(rwaConfig)

	});

	test('initalize asset controller through class', async () => {
		const SetupAssetControllerArgs: SetupAssetControllerArgs = {
			decimals,
			payer: setup.payer.toString(),
			authority: setup.authority.toString(),
			name: 'Test Class Asset',
			uri: 'https://test.com',
			symbol: 'TFT'
		};

		const setupIx = await rwaClient.assetController.setUpNewRegistry(SetupAssetControllerArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupIx.ixs), [setup.payerKp, ...setupIx.signers]);
		mint = setupIx.signers[0].publicKey.toString();
		expect(txnId).toBeTruthy();
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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...createDataAccountIx.ixs), [setup.payerKp, createDataAccountIx.signers[0]]);
		expect(txnId).toBeTruthy();
		dataAccount = createDataAccountIx.signers[0].publicKey.toString()
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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		remainingAccounts.push(policyIx.signers[0].publicKey.toString());
		expect(txnId).toBeTruthy();

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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		remainingAccounts.push(policyIx.signers[0].publicKey.toString());
		expect(txnId).toBeTruthy();

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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		remainingAccounts.push(policyIx.signers[0].publicKey.toString());
		expect(txnId).toBeTruthy();

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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		expect(txnId).toBeTruthy();

	})


	test('setup a user through class', async () => {
		const setupUserArgs: SetupUserArgs = {
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			level: 1,
		}
		const setupIx = await rwaClient.identityRegistry.setupUserIxns(setupUserArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupIx.ixs), [setup.payerKp, ...setupIx.signers]);
		expect(txnId).toBeTruthy();
		const trackerAccount = await getTrackerAccount(mint, setup.authority.toString());
		expect(trackerAccount).toBeTruthy();
		expect(trackerAccount!.assetMint.toString()).toBe(mint);
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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(issueIx), [setup.payerKp]);
		expect(txnId).toBeTruthy();

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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(updateDataIx), [setup.payerKp, setup.authorityKp]);
		expect(txnId).toBeTruthy();
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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(transferIx), [setup.payerKp]);
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
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(voidIx), [setup.payerKp]);
		expect(txnId).toBeTruthy();
	})
});
