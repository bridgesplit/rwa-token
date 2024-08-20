import { BN, Wallet } from "@coral-xyz/anchor";
import {
	type AttachPolicyArgs,
	CreateDataAccountArgs,
	DeleteDataAccountArgs,
	getDataAccountsWithFilter,
	getFreezeTokenIx,
	getPolicyAccount,
	getRevokeTokensIx,
	getSetupUserIxs,
	getThawTokenIx,
	getTrackerAccount,
	type IssueTokenArgs,
	type TransferTokensArgs,
	type UpdateDataAccountArgs,
	type VoidTokensArgs,
} from "../src";
import { setupTests } from "./setup";
import {
	type ConfirmOptions,
	Connection,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import { expect, test, describe } from "vitest";
import { type Config } from "../src/classes/types";
import { RwaClient } from "../src/classes";

describe("e2e tests", async () => {
	let rwaClient: RwaClient;
	let mint: string;
	const setup = await setupTests();

	const decimals = 2;
	let dataAccount: string;

	test("setup provider", async () => {
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
		mint = setupIx.signers[0].publicKey.toString();
		const setupUserIxs = await getSetupUserIxs({
			assetMint: mint,
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			signer: setup.authority.toString(),
			level: 255
		}, rwaClient.provider);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...setupIx.ixs).add(...setupUserIxs.ixs),
			[setup.payerKp, ...setupIx.signers, ...setupUserIxs.signers]
		);
		expect(txnId).toBeTruthy();
		const trackerAccount = await getTrackerAccount(
			mint,
			setup.authority.toString(),
			rwaClient.provider
		);
		expect(trackerAccount).toBeTruthy();
		expect(trackerAccount!.assetMint.toString()).toBe(mint);
	});

	test("update asset metadata", async () => {
		const updateAssetMetadataArgs = {
			authority: setup.authority.toString(),
			name: "Test Class Asset - Updated",
			assetMint: mint,
			payer: setup.payer.toString(),
		};

		const updateIx = await rwaClient.assetController.updateAssetMetadata(
			updateAssetMetadataArgs
		);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(updateIx),
			[setup.payerKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("setup data account", async () => {
		const createDataAccountArgs: CreateDataAccountArgs = {
			type: { legal: {} },
			name: "Test Data Account",
			uri: "https://test.com",
			payer: setup.payer.toString(),
			signer: setup.authority.toString(),
			assetMint: mint,
		};
		const createDataAccountIx = await rwaClient.dataRegistry.setupDataAccount(
			createDataAccountArgs
		);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...createDataAccountIx.ixs),
			[setup.payerKp, createDataAccountIx.signers[0], setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
		dataAccount = createDataAccountIx.signers[0].publicKey.toString();
		console.log(
			"data account: ",
			createDataAccountIx.signers[0].publicKey.toString()
		);
	});

	test("create identity approval policy", async () => {
		const policyArgs: AttachPolicyArgs = {
			authority: setup.authority.toString(),
			assetMint: mint,
			payer: setup.payer.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policyType: {
				identityApproval: {},
			},
		};

		const policyIx = await rwaClient.policyEngine.createPolicy(policyArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...policyIx.ixs),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("attach transaction amount limit policy", async () => {
		const policyArgs: AttachPolicyArgs = {
			payer: setup.payer.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policyType: {
				transactionAmountLimit: {
					limit: new BN(100),
				},
			},
		};

		const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs);

		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...policyIx.ixs),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});
	test("attach transaction amount velocity policy", async () => {
		const policyArgs: AttachPolicyArgs = {
			payer: setup.payer.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policyType: {
				transactionAmountVelocity: {
					limit: new BN(100000),
					timeframe: new BN(60),
				},
			},
		};

		const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...policyIx.ixs),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});
	test("attach transaction count velocity policy", async () => {
		const policyArgs: AttachPolicyArgs = {
			payer: setup.payer.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			identityFilter: {
				identityLevels: [1],
				comparisionType: { or: {} },
			},
			policyType: {
				transactionCountVelocity: {
					limit: new BN(100),
					timeframe: new BN(60),
				},
			},
		};

		const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...policyIx.ixs),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("issue tokens", async () => {
		const issueArgs: IssueTokenArgs = {
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			amount: 1000000,
		};
		const issueIx = await rwaClient.assetController.issueTokenIxns(issueArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...issueIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("void tokens", async () => {
		const voidArgs: VoidTokensArgs = {
			payer: setup.payer.toString(),
			amount: 100,
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
		};
		const voidIx = await rwaClient.assetController.voidTokenIxns(voidArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(voidIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("revoke tokens", async () => {
		const revokeIx = await getRevokeTokensIx({
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			amount: 100,
		}, rwaClient.provider);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(revokeIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("freeze and thaw token account", async () => {
		const freezeIx = await getFreezeTokenIx({
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
		}, rwaClient.provider);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(freezeIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();

		const thawIx = await getThawTokenIx({
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
		}, rwaClient.provider);
		const txnId2 = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(thawIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId2).toBeTruthy();
	});

	test("update data account", async () => {
		const updateDataAccountArgs: UpdateDataAccountArgs = {
			dataAccount,
			name: "Example Token Updates",
			uri: "newUri",
			type: { tax: {} },
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			signer: setup.authority.toString(),
		};
		const updateDataIx = await rwaClient.dataRegistry.updateAssetsDataAccountInfoIxns(updateDataAccountArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(updateDataIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("delete data account", async () => {
		const deleteDataAccountArgs: DeleteDataAccountArgs = {
			dataAccount,
			payer: setup.payer.toString(),
			owner: setup.authority.toString(),
			assetMint: mint,
			authority: setup.authority.toString(),
			signer: setup.authority.toString(),
		};
		const updateDataIx = await rwaClient.dataRegistry.deleteAssetsDataAccountInfoIxns(deleteDataAccountArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(updateDataIx),
			[setup.payerKp, setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
		expect(await getDataAccountsWithFilter({assetMint: mint}, rwaClient.provider)).toHaveLength(0);
	});

	test("transfer tokens", async () => {
		const transferArgs: TransferTokensArgs = {
			authority: setup.authority.toString(),
			payer: setup.payer.toString(),
			from: setup.authority.toString(),
			to: setup.authority.toString(),
			assetMint: mint,
			amount: 2000,
			decimals,
		};

		const transferIxs = await rwaClient.assetController.transfer(transferArgs);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(...transferIxs),
			[setup.payerKp]
		);
		expect(txnId).toBeTruthy();
	});

	test("detach all policies", async () => {
		let policyAccount = await getPolicyAccount(mint, rwaClient.provider);

		for (const policy of policyAccount?.policies ?? []) {
			const policyIx = await rwaClient.policyEngine.detachPolicy({
				authority: setup.authority.toString(),
				owner: setup.authority.toString(),
				assetMint: mint,
				payer: setup.payer.toString(),
				hash: policy.hash,
			});
			const txnId = await sendAndConfirmTransaction(
				rwaClient.provider.connection,
				new Transaction().add(...policyIx.ixs),
				[setup.payerKp, setup.authorityKp]
			);
			expect(txnId).toBeTruthy();
		}
		policyAccount = await getPolicyAccount(mint, rwaClient.provider);

		expect(policyAccount?.policies.length).toBe(0);
	});
});
