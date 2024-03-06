import { ConfirmOptions, Connection } from "@solana/web3.js";
import { RwaConfig } from "./types"
import { AssetControllerAccount, SetupAssetControllerArgs, getAssetControllerAccount, getSetupAssetControllerIxs } from "../asset_controller";
import { IxReturn } from "../utils";
import { getProvider } from "@coral-xyz/anchor";

export class AssetController {
    rwaConfig: RwaConfig;
    assetInfo?: AssetControllerAccount | undefined; // Make assetInfo optional
    isOwner?: boolean; // Make isOwner optional
    isDelegate?: boolean; // Make isDelegate optional

    // Constructor signature 1: With all parameters
    constructor(
        rwaConfig: RwaConfig,
        assetInfo: AssetControllerAccount | undefined,
        isOwner: boolean,
        isDelegate: boolean
    );

    // Constructor signature 2: Without assetInfo, isOwner, and isDelegate
    constructor(
        rwaConfig: RwaConfig
    );

    // Implementation of constructor
    constructor(
        rwaConfig: RwaConfig,
        assetInfo?: AssetControllerAccount | undefined,
        isOwner?: boolean,
        isDelegate?: boolean
    ) {
        this.rwaConfig = rwaConfig;
        this.assetInfo = assetInfo;
        this.isOwner = isOwner;
        this.isDelegate = isDelegate;
    }

    static async initialize(
        rwaConfig: RwaConfig, // Pass RwaConfig to initialize
        mint: string
    ): Promise<AssetController> {
        //TODO: get asset info from on-chain and return new assetController with its info
        const assetAccount = await getAssetControllerAccount(mint);
        // Create a new instance of AssetController using retrieved assetAccount and provided rwaConfig
        // Default isOwner and isDelegate to false. However need to do the check
        return new AssetController(rwaConfig, assetAccount, false, false);
    }
    async setUpNewRegistry(
        createAssetControllerArgs: SetupAssetControllerArgs
    ): Promise<IxReturn> {
        const setupAssetController = await getSetupAssetControllerIxs(
            createAssetControllerArgs,
        );
        return setupAssetController
    }

    async issueTokenIxns(){
        return;
    }
    async updateDelgateIxns(){
        return;
    }

    async updateASsetInfoIxns(){
        return;
    }

    async revokeAssetInxs(){
        return;
    }

    async updateDataRegistry(){
        return;
    }

    async attachPolicy(){
        return;
    }

    async simulateFakeTransfer(){
        return;
    }


    // Getters
    static getConnection(config: RwaConfig): Connection {
        return config.connection;
    }

    static getRpcUrl(config: RwaConfig): string {
        return config.rpcUrl;
    }

    static getConfirmationOptions(config: RwaConfig): ConfirmOptions {
        return config.confirmationOptions;
    }
}