import { BN, Wallet } from "@coral-xyz/anchor";
import {
	getPolicyAccountPda,
	getPolicyEngineProgram,
	getTransferTokensIxs,
	RwaClient,
} from "../../src";
import { setupTests } from "../setup";
import { ConfirmOptions, Connection, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { expect, test, describe } from "vitest";
import { Config } from "../../src/classes/types";

describe("test transaction count velocity policy", async () => {
	let rwaClient: RwaClient;
	let mint: string;
	const setup = await setupTests();

	const decimals = 2;

	test("setup environment", async () => {
		const connectionUrl = process.env.RPC_URL ?? "http://localhost:8899";
		const connection = new Connection(connectionUrl);

		const confirmationOptions: ConfirmOptions = {
			skipPreflight: false,
			maxRetries: 3,
			commitment: "processed",
		};

		const config: Config = {
			connection,
			rpcUrl: connectionUrl,
			confirmationOptions,
		};

		rwaClient = new RwaClient(config, new Wallet(setup.payerKp));

		// Create asset controller
		const createAssetControllerArgs = {
			decimals,
			payer: setup.payer.toString(),
			authority: setup.authority.toString(),
			name: "Test Asset",
			uri: "https://test.com",
			symbol: "TST",
		};
		const setupAssetController = await rwaClient.assetController.setupNewRegistry(
			createAssetControllerArgs
		);
		const txnId = await sendAndConfirmTransaction(
			setup.provider.connection,
			new Transaction().add(...setupAssetController.ixs),
			[setup.payerKp, setup.authorityKp, ...setupAssetController.signers]
		);
		mint = setupAssetController.signers[0].publicKey.toString();
		expect(txnId).toBeTruthy();

		// Setup users
		const setupUser1 = await rwaClient.identityRegistry.setupUserIxns({
			payer: setup.payer.toString(),
			owner: setup.user1.toString(),
			assetMint: mint,
			levels: [1],
			signer: setup.authorityKp.publicKey.toString()
		});
		await sendAndConfirmTransaction(
			setup.provider.connection,
			new Transaction().add(...setupUser1.ixs),
			[setup.payerKp, setup.authorityKp, ...setupUser1.signers]
		);

		const setupUser2 = await rwaClient.identityRegistry.setupUserIxns({
			payer: setup.payer.toString(),
			owner: setup.user2.toString(),
			assetMint: mint,
			levels: [1],
			signer: setup.authorityKp.publicKey.toString()
		});
		await sendAndConfirmTransaction(
			setup.provider.connection,
			new Transaction().add(...setupUser2.ixs),
			[setup.payerKp, setup.authorityKp, ...setupUser2.signers]
		);

		// Issue tokens to user1
		const issueTokens = await rwaClient.assetController.issueTokenIxns({
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			owner: setup.user1.toString(),
			assetMint: mint,
			amount: 1000000,
		});
		await sendAndConfirmTransaction(
			setup.provider.connection,
			new Transaction().add(...issueTokens),
			[setup.payerKp, setup.authorityKp]
		);
	});

	test("attach transaction count velocity policy", async () => {
		const attachPolicy = await rwaClient.policyEngine.createPolicy({
			payer: setup.payer.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policyType: {
				transactionCountVelocity: {
					limit: new BN(3),
					timeframe: new BN(60), // 60 seconds
				},
			},
		});
		const txnId = await sendAndConfirmTransaction(
			setup.provider.connection,
			new Transaction().add(...attachPolicy.ixs),
			[setup.payerKp, setup.authorityKp, ...attachPolicy.signers]
		);
		expect(txnId).toBeTruthy();

		const policyAccount = await getPolicyEngineProgram(setup.provider).account.policyAccount.fetch(getPolicyAccountPda(mint));
		expect(policyAccount.policies.length).toBe(1);
	});

	test("transfer tokens within limit", async () => {
		for (let i = 0; i < 3; i++) {
			const transferTokensIxs = await getTransferTokensIxs({
				from: setup.user1.toString(),
				to: setup.user2.toString(),
				assetMint: mint,
				amount: 10,
				decimals,
				createTa: i == 0,
			}, rwaClient.provider);
            
			const txnId = await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...transferTokensIxs),
				[setup.user1Kp],
			);
			expect(txnId).toBeTruthy();
		}
	});

	test("transfer tokens exceeding limit", async () => {
		const transferTokensIxs = await getTransferTokensIxs({
			from: setup.user1.toString(),
			to: setup.user2.toString(),
			assetMint: mint,
			amount: 10,
			decimals,
		}, rwaClient.provider);
        
		expect(sendAndConfirmTransaction(
			setup.provider.connection,
			new Transaction().add(...transferTokensIxs),
			[setup.user1Kp],
		)).rejects.toThrowError(/custom program error: 0x1773/);
	});

	test("wait for policy reset and transfer again", async () => {
		// Wait for 60 seconds to reset the policy
		await new Promise(resolve => setTimeout(resolve, 61000));

		const transferTokensIxs = await getTransferTokensIxs({
			from: setup.user1.toString(),
			to: setup.user2.toString(),
			assetMint: mint,
			amount: 10,
			decimals,
		}, rwaClient.provider);
        
		const txnId = await sendAndConfirmTransaction(
			setup.provider.connection,
			new Transaction().add(...transferTokensIxs),
			[setup.user1Kp],
		);
		expect(txnId).toBeTruthy();
	});
});