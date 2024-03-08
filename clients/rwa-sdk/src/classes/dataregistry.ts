import { ConfirmOptions, Connection, Keypair, TransactionInstruction } from "@solana/web3.js";
import { RwaConfig } from "./types"
import { IxReturn } from "../utils";

/**
 * Represents the client for Data Registry for an RWA.
 */
export class DataRegistry {
    rwaConfig: RwaConfig;

    constructor(rwaConfig: RwaConfig) {
        this.rwaConfig = rwaConfig;
    }

    /**
     * Asynchronously generates instructions to update asset information.
     * @returns A Promise that resolves to the instructions to update asset information.
    */
   //TODO: Missing instructions
    async updateAssetsDataRegistryInfoIxns(): Promise<IxReturn> {
        return {
            ixs: [],
            signers: []
        };
    }


    /** Helpful asset controller getters */
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