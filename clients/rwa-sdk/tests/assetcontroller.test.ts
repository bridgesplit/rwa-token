/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BN } from '@coral-xyz/anchor';
import {
	getAttachPolicyAccountIx, getSetupAssetControllerIxs, getSetupIssueTokensIxs, getSetupUserIxs, getTrackerAccount, getTransferTokensIx, Policy,
} from '../src';
import { setupTests } from './setup';
import { Commitment, Connection, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { expect, test, describe } from 'vitest';
import { AssetController } from '../src/classes/assetcontroller';
import { RwaConfig } from '../src/classes/types';
import { RwaClient } from '../src/classes/rwa';

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

	test('initalize asset controller', async () => {
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
			connection: connection,
			rpcUrl: 'https://api.mainnet-beta.solana.com',
			confirmationOptions: confirmationOptions
		}

		const SetupAssetControllerArgs = {
			decimals,
			payer: setup.payer.toString(),
			authority: setup.authority.toString(),
			name: 'Test Asset',
			uri: 'https://test.com',
			symbol: 'TST'
		};

		const rwaClient = new RwaClient(rwaConfig)
		const setupIx = await rwaClient.assetController.setUpNewRegistry(SetupAssetControllerArgs)
		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupIx.ixs), [setup.payerKp, ...setupIx.signers]);
		mint = setupIx.signers[0].publicKey.toString();
		expect(txnId).toBeTruthy();
	});

	// describe('issueTokensIxns', () => {
    //     test('should return instruction to issue tokens', () => {
    //         // Mock required data and verify the returned instruction
    //         const instruction = assetControllerAction.issueTokensIxns();
	// 		const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...instruction), [setup.payerKp, ...instruction.signers]);
	// 		expect(txnId).toBeTruthy();        });
    // });

});
