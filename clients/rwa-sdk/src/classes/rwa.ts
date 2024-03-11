import {type Config} from './types';
import {AssetController} from './assetcontroller';
import {IdentityRegistry} from './identityRegistry';
import {PolicyEngine} from './policyengine';
import {DataRegistry} from './dataregistry';
import {AnchorProvider, type Wallet} from '@coral-xyz/anchor';

/**
 * Represents a client for interacting with Real World Assets (RWA).
 */

// TODO: Getter functions. I am assuming this will be handled by Helius DAS api.
export class RwaClient {
	/**
     * Configuration for the RWA client.
     */
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
		this.provider = new AnchorProvider(config.connection, wallet, config.confirmationOptions);
		this.assetController = new AssetController(this);
		this.dataRegistry = new DataRegistry(this);
		this.identityRegistry = new IdentityRegistry(this);
		this.policyEngine = new PolicyEngine(this);
	}

	/**
     * Retrieves all policy accounts.
     * @returns A Promise resolving to an array of policy accounts.
     */
	async getPolicyAccounts() {

	}

	/**
     * Retrieves policy accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve policy accounts.
     * @returns A Promise resolving to an array of policy accounts.
     */
	async getPolicyAccountsByMint(mint: string) {

	}

	/**
     * Retrieves all asset accounts.
     * @returns A Promise resolving to an array of asset accounts.
     */
	async getAssets() {

	}

	/**
     * Retrieves asset accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve asset accounts.
     * @returns A Promise resolving to an array of asset accounts.
     */
	async getAssetsByMint(mint: string) {

	}

	/**
     * Retrieves all identity accounts.
     * @returns A Promise resolving to an array of identity accounts.
     */
	async getIdentityAccounts() {

	}

	/**
     * Retrieves identity accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve identity accounts.
     * @returns A Promise resolving to an array of identity accounts.
     */
	async getIdentityAccountsByMint(mint: string) {

	}

	/**
     * Retrieves all data registry accounts.
     * @returns A Promise resolving to an array of data registry accounts.
     */
	async getDataRegistryAccounts() {

	}

	/**
     * Retrieves data registry accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve data registry accounts.
     * @returns A Promise resolving to an array of data registry accounts.
     */
	async getDataRegistryAccountsByMint(mint: string) {

	}
}
