# Medici SDK Quickstart

## Install Package

**Step 1:** Install Medici

```typescript
yarn add @bridgesplit/rwa-token-sdk
```

## Initialize RWA Client

**Step 2:** Begin by importing the RWA client and instantiating it with its respective parameters.

```typescript
const connectionUrl = process.env.RPC_URL ?? "http://localhost:8899";
const connection = new Connection(connectionUrl);

const confirmationOptions: ConfirmOptions = {
  skipPreflight: false,
  maxRetries: 3,
  commitment: "processed",
};

const config: Config = {
  connection: connection,
  rpcUrl: connectionUrl,
  confirmationOptions: confirmationOptions,
};

/* Setup: payerKp, is just the keypair who will pay for the tx. */
const rwaClient = new RwaClient(config, new Wallet(setup.payerKp));
```

## Initialize an Asset Controller

**Step 3:** Initialize an asset controller on chain.

```typescript
const SetupAssetControllerArgs = {
  decimals /* Token decimals */,
  payer: setup.payer.toString() /* The wallet who will pay */,
  authority: setup.authority.toString() /* Token decimals */,
  name: "Test Class Asset",
  uri: "https://test.com",
  symbol: "TFT",
  /*

	You can always update name, uri, symbol later via
	rwaClient.dataRegistry.updateAssetsDataAccountInfoIxns()

	*/
};

const setupIx = await rwaClient.assetController.setupNewRegistry(
  SetupAssetControllerArgs
);
const txnId = await sendAndConfirmTransaction(
  rwaClient.provider.connection,
  new Transaction().add(...setupIx.ixs),
  [setup.payerKp, ...setupIx.signers]
);
const mint =
  setupIx.signers[0].publicKey.toString(); /* Make sure to record assets mint */
```

## Setup Data Registry

**Step 4:** Create the data registry account.

```typescript
const createDataAccountArgs: CreateDataAccountArgs = {
  type: {
    legal: {},
  } /* This is where your record of legal documentation will go */,
  name: "Test Data Account",
  uri: "https://test.com",
  payer: setup.payer.toString(),
  assetMint: mint,
};

/* Note: you can update the data registry later with rwaClient.dataRegistry.updateAssetsDataAccountInfoIxns() */
const createDataAccountIx = await rwaClient.dataRegistry.setupDataAccount(
  createDataAccountArgs
);

const txnId = await sendAndConfirmTransaction(
  rwaClient.provider.connection,
  new Transaction().add(...createDataAccountIx.ixs),
  [setup.payerKp, createDataAccountIx.signers[0]]
);
const dataAccount = createDataAccountIx.signers[0].publicKey.toString();
```

## Attach a Policy

**Step 5:** Use the policy engine to attach policies to the asset.

```typescript
const policyArgs: AttachPolicyArgs = {
  authority: setup.authority.toString(),
  owner: setup.authority.toString(),
  assetMint: mint,
  payer: setup.payer.toString(),
  /* Identity filter is used for group specific policies */
  identityFilter: {
    identityLevels: [1],
    comparisionType: { or: {} },
  },
  policy: {
    identityApproval: {},
    /*

		The following are example policy's you can pass instead of identity approval:

		transactionAmountLimit: {
			limit: new BN(100),
		}

		transactionAmountVelocity: {
			limit: new BN(100000)
			timeframe: new BN(60)
		}

		transactionCountVelocity: {
			limit: new BN(100),
			timeframe: new BN(60),
		}

		,*/
  },
};

const policyIx = await rwaClient.policyEngine.attachPolicy(policyArgs);
const txnId = await sendAndConfirmTransaction(
  rwaClient.provider.connection,
  new Transaction().add(...policyIx.ixs),
  [setup.payerKp, ...policyIx.signers]
);

remainingAccounts.push(policyIx.signers[0].publicKey.toString());
```
