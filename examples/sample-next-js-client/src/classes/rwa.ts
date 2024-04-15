import { type Config } from './types';
import { AssetController } from './assetcontroller';
import { IdentityRegistry } from './identityregistry';
import { PolicyEngine } from './policyengine';
import { DataRegistry } from './dataregistry';
import { AnchorProvider } from '@bridgesplit/anchor';
import { Transaction, VersionedTransaction, PublicKey } from '@solana/web3.js';

export interface Wallet {
	signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
	signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
	publicKey: PublicKey;
} // ccopy of anchor walet becayse cannot import for some reason

/**
 * Represents a client for interacting with Real World Assets (RWA).
 *
 * TODO: Determine wether or not view holders, view policies, view identities for a token, view data is handled by SDK?
 */
export class RwaClient {
	/**
   * Configuration for the RWA client.
   */
	// eslint-disable-next-line @typescript-eslint/parameter-properties
	config: Config;
	provider: AnchorProvider;
	assetController: AssetController;
	dataRegistry: DataRegistry;
	identityRegistry: IdentityRegistry;
	policyEngine: PolicyEngine;

	/**
   * Constructs a new instance of the RwaClient.
   * @param rwaConfig The configuration for the RWA client.
   * @param wallet Anchor wallet used for provider
   */
	constructor(config: Config, wallet: Wallet) {
		this.config = config;
		this.provider = new AnchorProvider(
			config.connection,
			wallet,
			config.confirmationOptions,
		);
		this.assetController = new AssetController(this);
		this.dataRegistry = new DataRegistry(this);
		this.identityRegistry = new IdentityRegistry(this);
		this.policyEngine = new PolicyEngine(this);
	}
}
