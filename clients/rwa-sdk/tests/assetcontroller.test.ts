/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BN } from '@coral-xyz/anchor';
import {
	AttachPolicyArgs,
	getAttachPolicyAccountIx, getSetupAssetControllerIxs, getSetupIssueTokensIxs, getSetupUserIxs, getTrackerAccount, getTransferTokensIx, Policy, voidTokenArgs,
} from '../src';
import { setupTests } from './setup';
import { Commitment, Connection, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { expect, test, describe } from 'vitest';
import { AssetController } from '../src/classes/assetcontroller';
import { RwaConfig } from '../src/classes/types';
import { RwaClient } from '../src/classes/rwa';

describe('e2e class tests', () => {
	let rwaClient: RwaClient
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
		const SetupAssetControllerArgs = {
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

		const policyIx = await rwaClient.assetController.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
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

		const policyIx = await rwaClient.assetController.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
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

		const policyIx = await rwaClient.assetController.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
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

		const policyIx = await rwaClient.assetController.attachPolicy(policyArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...policyIx.ixs), [setup.payerKp, ...policyIx.signers]);
		expect(txnId).toBeTruthy();

	})

	test('revoke tokens', async () => {
		const voidArgs: voidTokenArgs = {
			payer: setup.payer.toString(),
			amount: 100,
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
		}
		const voidIx = await rwaClient.assetController.voidTokenIxns(voidArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...voidIx.ixs), [setup.payerKp, ...voidIx.signers]);
		expect(txnId).toBeTruthy();

	})
});
