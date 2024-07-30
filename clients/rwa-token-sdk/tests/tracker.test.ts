import { BN, Wallet } from "@coral-xyz/anchor";
import {
	type AttachPolicyArgs,
	getTrackerAccount,
	type IssueTokenArgs,
	type SetupUserArgs,
	type TransferTokensArgs,
} from "../src";
import { setupTests } from "./setup";
import {
	Commitment,
	type ConfirmOptions,
	Connection,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import { expect, test, describe } from "vitest";
import { type Config } from "../src/classes/types";
import { RwaClient } from "../src/classes";

describe("test suite to test tracker account is being updated correctly on transfers, data is correctly being stored and discarded and to test the limit of transfers that can be tracked", async () => {
	let rwaClient: RwaClient;
	let mint: string;
	const setup = await setupTests();
	const decimals = 9;

	test("setup provider", async () => {
		const connectionUrl = process.env.RPC_URL ?? "http://localhost:8899";
		const connection = new Connection(connectionUrl);

		const confirmationOptions: ConfirmOptions = {
			skipPreflight: false,
			maxRetries: 3,
		};

		const config: Config = {
			connection,
			rpcUrl: connectionUrl,
			confirmationOptions,
		};

		rwaClient = new RwaClient(config, new Wallet(setup.payerKp));
	});

	test("initalize asset controller", async () => {
		const setupAssetControllerArgs = {
			decimals,
			payer: setup.payer.toString(),
			authority: setup.authority.toString(),
			name: "Test Class Asset",
			uri: "https://test.com",
			symbol: "TFT",
		};

		const setupIx = await rwaClient.assetController.setupNewRegistry(
			setupAssetControllerArgs
		);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...setupIx.ixs),
			[setup.payerKp, ...setupIx.signers]
		);
		mint = setupIx.signers[0].publicKey.toString();
		expect(txnId).toBeTruthy();
	});

	test("setup user1 and user2", async () => {
		const setupUser1Args: SetupUserArgs = {
			payer: setup.payer.toString(),
			owner: setup.user1.toString(),
			signer: setup.authority.toString(),
			assetMint: mint,
			level: 1,
		};
		const setupIx1 = await rwaClient.identityRegistry.setupUserIxns(
			setupUser1Args
		);
		const txnId1 = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...setupIx1.ixs),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId1).toBeTruthy();
		const setupUser2Args: SetupUserArgs = {
			payer: setup.payer.toString(),
			owner: setup.user2.toString(),
			signer: setup.authority.toString(),
			assetMint: mint,
			level: 1,
		};
		const setupIx2 = await rwaClient.identityRegistry.setupUserIxns(
			setupUser2Args
		);
		const txnId2 = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...setupIx2.ixs),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId2).toBeTruthy();
		const trackerAccount1 = await getTrackerAccount(
			mint,
			setup.user1.toString(),
			rwaClient.provider
		);
		expect(trackerAccount1).toBeTruthy();
		expect(trackerAccount1!.assetMint.toString()).toBe(mint);
		expect(trackerAccount1!.owner.toString()).toBe(setup.user1.toString());
		const trackerAccount2 = await getTrackerAccount(
			mint,
			setup.user2.toString(),
			rwaClient.provider
		);
		expect(trackerAccount2).toBeTruthy();
		expect(trackerAccount2!.assetMint.toString()).toBe(mint);
	});

	test("issue tokens", async () => {
		const issueArgs: IssueTokenArgs = {
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			owner: setup.user1.toString(),
			assetMint: mint,
			amount: 1000000,
		};
		const issueIx = await rwaClient.assetController.issueTokenIxns(issueArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(issueIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("transfer tokens", async () => {
		const transferArgs: TransferTokensArgs = {
			payer: setup.payer.toString(),
			from: setup.user1.toString(),
			to: setup.user2.toString(),
			assetMint: mint,
			amount: 100,
			decimals,
		};

		const transferIx = await rwaClient.assetController.transfer(transferArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(transferIx),
			[setup.payerKp, setup.user1Kp]
		);
		expect(txnId).toBeTruthy();
		const trackerAccount = await getTrackerAccount(
			mint,
			setup.user2.toString(),
			rwaClient.provider
		);
		// length of transfers should be 0 since any policies haven;t beeen attached yet
		expect(trackerAccount!.transfers.length).toBe(0);
	});

	test("attach transfer amount limit policy", async () => {
		const attachPolicyArgs: AttachPolicyArgs = {
			payer: setup.payer.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: {or: {}}
			},
			policyType: {transactionAmountVelocity: { limit: new BN(1000000000000), timeframe: new BN(1000000000000) }} // enough limit and timeframe to allow a lot of transfers
		};
		const attachPolicyIx = await rwaClient.policyEngine.createPolicy(
			attachPolicyArgs
		);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...attachPolicyIx.ixs),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("do 25 transfers, fail for the 26th time because transfer history is full", async () => {
		for(let i = 0; i < 25; i++) {
			const transferArgs: TransferTokensArgs = {
				payer: setup.payer.toString(),
				from: setup.user1.toString(),
				to: setup.user2.toString(),
				assetMint: mint,
				amount: 100,
				decimals,
			};
	
			const transferIx = await rwaClient.assetController.transfer(transferArgs);
			let commitment: Commitment = "processed";
			if (i < 4) {
				commitment = "finalized";
			}
			const txnId = await sendAndConfirmTransaction(
				rwaClient.provider.connection,
				new Transaction().add(transferIx),
				[setup.payerKp, setup.user1Kp],
				{
					commitment,
				}
			);
			expect(txnId).toBeTruthy();
			if(i<4) { // dont need to check for all 25 transfers
				const trackerAccount = await getTrackerAccount(
					mint,
					setup.user2.toString(),
					rwaClient.provider
				);
				expect(trackerAccount!.transfers.length).toBe(i + 1);
				expect(trackerAccount!.transfers.at(i)?.amount == 100);
			}
		}
		const transferArgs: TransferTokensArgs = {
			payer: setup.payer.toString(),
			from: setup.user1.toString(),
			to: setup.user2.toString(),
			assetMint: mint,
			amount: 100,
			decimals,
		};

		const transferIx = await rwaClient.assetController.transfer(transferArgs);
		expect(sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(transferIx),
			[setup.payerKp, setup.user1Kp]
		)).rejects.toThrowError(/failed \(\{"err":\{"InstructionError":\[0,\{"Custom":6006\}\]\}\}\)/);
	});

});
