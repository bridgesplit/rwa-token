import { Wallet } from "@coral-xyz/anchor";
import {
	getCloseMintIx,
	getUpdateInterestBearingMintRateIx,
} from "../src";
import { setupTests } from "./setup";
import {
	type ConfirmOptions,
	Connection,
	PublicKey,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import { expect, test, describe } from "vitest";
import { type Config } from "../src/classes/types";
import { RwaClient } from "../src/classes";
import { getInterestBearingMintConfigState, getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("extension tests", async () => {
	let rwaClient: RwaClient;
	let mint: string;
	const setup = await setupTests();

	const decimals = 2;

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
			interestRate: 100,
			tranferMemo: true,
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
		const mintData = await getMint(
			rwaClient.provider.connection,
			new PublicKey(mint),
			undefined,
			TOKEN_2022_PROGRAM_ID,
		);
		const interestBearingMintConfig = getInterestBearingMintConfigState(
			mintData,
		);
		expect(interestBearingMintConfig?.currentRate).toEqual(100);
		// const tokenAccount = await getAccount(
		// 	rwaClient.provider.connection,
		// 	getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(setup.authority.toString()), undefined, TOKEN_2022_PROGRAM_ID),
		// 	undefined,
		// 	TOKEN_2022_PROGRAM_ID
		// );
		// // Get Interest Config for Mint Account
		// const memoTransfer = getMemoTransfer(
		// 	tokenAccount, 
		// );
		// expect(memoTransfer?.requireIncomingTransferMemos).toEqual(true);
	});


	test("update interest rate", async () => {
		const updateIx = await getUpdateInterestBearingMintRateIx(
			{
				authority: setup.authority.toString(),
				assetMint: mint,
				payer: setup.payer.toString(),
				rate: 200,
			},
			rwaClient.provider
		);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(updateIx),
			[setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
		const mintData = await getMint(
			rwaClient.provider.connection,
			new PublicKey(mint),
			undefined,
			TOKEN_2022_PROGRAM_ID,
		);
		const interestBearingMintConfig = getInterestBearingMintConfigState(
			mintData,
		);
		expect(interestBearingMintConfig?.currentRate).toEqual(200);
	});

	test("close mint account", async () => {
		const closeIx = await getCloseMintIx(
			{
				authority: setup.authority.toString(),
				assetMint: mint,
				payer: setup.payer.toString(),
			},
			rwaClient.provider
		);
		const txnId = await sendAndConfirmTransaction(
			rwaClient.provider.connection,
			new Transaction().add(closeIx),
			[setup.authorityKp]
		);
		expect(txnId).toBeTruthy();
		expect(getMint(
			rwaClient.provider.connection,
			new PublicKey(mint),
			undefined,
			TOKEN_2022_PROGRAM_ID,
		)).rejects.toThrow();
	});

	// test("disable transfer memo", async () => {
	// 	const updateIx = await getDisableMemoTransferIx(
	// 		{
	// 			owner: setup.authority.toString(),
	// 			tokenAccount: getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(setup.authority.toString()), undefined, TOKEN_2022_PROGRAM_ID).toString(),
	// 		},
	// 		rwaClient.provider
	// 	);
	// 	const txnId = await sendAndConfirmTransaction(
	// 		rwaClient.provider.connection,
	// 		new Transaction().add(updateIx),
	// 		[setup.authorityKp]
	// 	);
	// 	expect(txnId).toBeTruthy();
	// 	const mintAccount = await getAccount(
	// 		rwaClient.provider.connection,
	// 		new PublicKey(mint),
	// 		undefined,
	// 		TOKEN_2022_PROGRAM_ID,
	// 	);
	// 	// Get Interest Config for Mint Account
	// 	const interestBearingMintConfig = getMemoTransfer(
	// 		mintAccount, 
	// 	);
	// 	expect(interestBearingMintConfig?.requireIncomingTransferMemos).toEqual(false);
	// });

});
