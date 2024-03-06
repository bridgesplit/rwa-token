import { ConfirmOptions, Connection } from "@solana/web3.js";
import { RwaConfig } from "./types"
import { AssetControllerAccount, SetupAssetControllerArgs, getAssetControllerAccount, getSetupAssetControllerIxs } from "../asset_controller";
import { IxReturn } from "../utils";
import { getProvider } from "@coral-xyz/anchor";

export class RwaClient {
    rwaConfig: RwaConfig;

    constructor(
        rwaConfig: RwaConfig,
    ) {
        this.rwaConfig = rwaConfig;
    }

    async getPolicyAccounts() {
        return
    }
    async getPolicyAccountsByMint(mint: string) {
        return
    }

    async getAssets() {
        return
    }

    async getAssetsByMint(mint: string) {
        return
    }

    async getIdentityAccounts() {
        return
    }
    async getIdentityAccountsByMint(mint: string) {
        return
    }
    async getDataRegistryAccounts() {
        return
    }
    async getDataRegistryAccountsByMint(mint: string) {
        return
    }


}