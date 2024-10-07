import { BN, Wallet } from "@coral-xyz/anchor";
import {
	getTransferTokensIxs,
	RwaClient,
} from "../../src";
import { setupTests } from "../setup";
import { ConfirmOptions, Connection, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { expect, test, describe } from "vitest";
import { Config } from "../../src/classes/types";

describe("test additional policies", async () => {
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
	
	describe("test BalanceLimit policy", async () => {
		const balanceLimit = new BN(1500000); // 15,000 tokens with 2 decimals
		let currentBalance = new BN(1000000); // Starting balance for the policy (10,000 tokens)

		test("attach BalanceLimit policy", async () => {
			const attachPolicy = await rwaClient.policyEngine.createPolicy({
				payer: setup.payer.toString(),
				assetMint: mint,
				authority: setup.authority.toString(),
				identityFilter: {
					identityLevels: [1],
					comparisionType: { or: {} },
				},
				policyType: { 
					balanceLimit: { 
						limit: balanceLimit,
						currentBalance: currentBalance
					} 
				},
			});
			const txnId = await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...attachPolicy.ixs),
				[setup.payerKp, setup.authorityKp, ...attachPolicy.signers]
			);
			expect(txnId).toBeTruthy();
		});

		test("transfer within group (should not affect total balance)", async () => {
			const transferAmount = 200000; // 2,000 tokens
			const transferTokensIxs = await getTransferTokensIxs({
				from: setup.user1.toString(),
				to: setup.user2.toString(),
				assetMint: mint,
				amount: transferAmount,
				decimals,
				createTa: true,
			}, rwaClient.provider);
            
			const txnId = await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...transferTokensIxs),
				[setup.user1Kp],
			);
			expect(txnId).toBeTruthy();
			// currentBalance remains unchanged as this is a transfer within the group
		});

		test("transfer into group within limit", async () => {
			// Create and setup user3 without identity level 1
			const setupUser3 = await rwaClient.identityRegistry.setupUserIxns({
				payer: setup.payer.toString(),
				owner: setup.user3.toString(),
				assetMint: mint,
				levels: [2], // Different identity level
				signer: setup.authorityKp.publicKey.toString()
			});
			await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...setupUser3.ixs),
				[setup.payerKp, setup.authorityKp, ...setupUser3.signers]
			);

			// Issue tokens to user3
			const issueAmount = 400000; // 4,000 tokens
			const issueTokens = await rwaClient.assetController.issueTokenIxns({
				authority: setup.authority.toString(),
				payer: setup.payer.toString(),
				owner: setup.user3.toString(),
				assetMint: mint,
				amount: issueAmount,
			});
			await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...issueTokens),
				[setup.payerKp, setup.authorityKp]
			);

			// Transfer from user3 to user1 (into the group)
			const transferTokensIxs = await getTransferTokensIxs({
				from: setup.user3.toString(),
				to: setup.user1.toString(),
				assetMint: mint,
				amount: issueAmount,
				decimals,
			}, rwaClient.provider);
            
			const txnId = await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...transferTokensIxs),
				[setup.user3Kp],
			);
			expect(txnId).toBeTruthy();
			currentBalance = currentBalance.add(new BN(issueAmount));
		});

		test("attempt transfer into group exceeding limit", async () => {
			// Issue more tokens to user3
			const issueAmount = 200000; // 2,000 tokens
			const issueTokens = await rwaClient.assetController.issueTokenIxns({
				authority: setup.authority.toString(),
				payer: setup.payer.toString(),
				owner: setup.user3.toString(),
				assetMint: mint,
				amount: issueAmount,
			});
			await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...issueTokens),
				[setup.payerKp, setup.authorityKp]
			);

			// Attempt to transfer from user3 to user1 (which would exceed the limit)
			const transferTokensIxs = await getTransferTokensIxs({
				from: setup.user3.toString(),
				to: setup.user1.toString(),
				assetMint: mint,
				amount: issueAmount,
				decimals,
			}, rwaClient.provider);
            
			await expect(sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...transferTokensIxs),
				[setup.user3Kp],
			)).rejects.toThrow(/custom program error: 0x1782/);
		});

		test("transfer out of group (should reduce total balance)", async () => {
			const transferAmount = 200000; // 2,000 tokens
			const transferTokensIxs = await getTransferTokensIxs({
				from: setup.user1.toString(),
				to: setup.user3.toString(), // user3 is not in the identity group
				assetMint: mint,
				amount: transferAmount,
				decimals,
			}, rwaClient.provider);
            
			const txnId = await sendAndConfirmTransaction(
				setup.provider.connection,
				new Transaction().add(...transferTokensIxs),
				[setup.user1Kp],
			);
			expect(txnId).toBeTruthy();
			currentBalance = currentBalance.sub(new BN(transferAmount));
		});
	});

});