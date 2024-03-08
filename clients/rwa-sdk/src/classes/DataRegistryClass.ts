import { ConfirmOptions, Connection, Keypair, TransactionInstruction } from "@solana/web3.js";
import { RwaConfig } from "./types"
import { IxReturn } from "../utils";
import { CreateDataAccountArgs, DelegateDataRegistryArgs, UpdateDataAccountArgs, getCreateDataAccountIx, getDelegateDataRegistryIx, getUpdateDataAccountIx } from "../data_registry";

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
    async setupDataAccount(createDataAccountArgs: CreateDataAccountArgs): Promise<IxReturn> {
        const createDataAccountIx = await getCreateDataAccountIx(createDataAccountArgs)
        return createDataAccountIx
    }

    /**
     * Asynchronously generates instructions to update asset information.
     * @returns A Promise that resolves to the instructions to update asset information.
    */
    async updateAssetsDataAccountInfoIxns(updateArgs: UpdateDataAccountArgs): Promise<TransactionInstruction> {
        const updateIx = await getUpdateDataAccountIx(updateArgs)
        return updateIx
    }

    /**
     * Asynchronously generates instructions to update asset information.
     * @returns A Promise that resolves to the instructions to update asset information.
    */
    async delegateDataRegistry(delegateDataRegistryArgs: DelegateDataRegistryArgs): Promise<TransactionInstruction> {
        const delegateIx = await getDelegateDataRegistryIx(delegateDataRegistryArgs)
        return delegateIx
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