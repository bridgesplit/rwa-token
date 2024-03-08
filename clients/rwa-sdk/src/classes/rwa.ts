import { RwaConfig } from "./types"
import { AssetController } from "./assetcontroller";
import { IdentityRegistry } from "./identityRegistry";
import { PolicyEngine } from "./policyengine";
import { DataRegistry } from "./dataregistry";

/**
 * Represents a client for interacting with Real World Assets (RWA).
 */

// TODO: Getter functions. I am assuming this will be handled by Helius DAS api.
export class RwaClient {
    /**
     * Configuration for the RWA client.
     */
    rwaConfig: RwaConfig;
    assetController: AssetController;
    dataRegistry: DataRegistry;
    identityRegistry: IdentityRegistry;
    policyEngine: PolicyEngine

    /**
     * Constructs a new instance of the RwaClient.
     * @param rwaConfig The configuration for the RWA client.
     */
    constructor(rwaConfig: RwaConfig) {
        this.rwaConfig = rwaConfig;
        this.assetController = new AssetController(rwaConfig);
        this.dataRegistry = new DataRegistry(rwaConfig);
        this.identityRegistry = new IdentityRegistry(rwaConfig);
        this.policyEngine = new PolicyEngine(rwaConfig);

    }
    /**
     * Retrieves all policy accounts.
     * @returns A Promise resolving to an array of policy accounts.
     */
    async getPolicyAccounts() {
        return;
    }

    /**
     * Retrieves policy accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve policy accounts.
     * @returns A Promise resolving to an array of policy accounts.
     */
    async getPolicyAccountsByMint(mint: string) {
        return;
    }

    /**
     * Retrieves all asset accounts.
     * @returns A Promise resolving to an array of asset accounts.
     */
    async getAssets() {
        return;
    }

    /**
     * Retrieves asset accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve asset accounts.
     * @returns A Promise resolving to an array of asset accounts.
     */
    async getAssetsByMint(mint: string) {
        return;
    }

    /**
     * Retrieves all identity accounts.
     * @returns A Promise resolving to an array of identity accounts.
     */
    async getIdentityAccounts() {
        return;
    }

    /**
     * Retrieves identity accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve identity accounts.
     * @returns A Promise resolving to an array of identity accounts.
     */
    async getIdentityAccountsByMint(mint: string) {
        return;
    }

    /**
     * Retrieves all data registry accounts.
     * @returns A Promise resolving to an array of data registry accounts.
     */
    async getDataRegistryAccounts() {
        return;
    }

    /**
     * Retrieves data registry accounts associated with the provided mint.
     * @param mint The mint address for which to retrieve data registry accounts.
     * @returns A Promise resolving to an array of data registry accounts.
     */
    async getDataRegistryAccountsByMint(mint: string) {
        return;
    }


}