import { ConfirmOptions, Connection, Keypair, TransactionInstruction } from "@solana/web3.js";
import { RwaConfig } from "./types"
import { SetupAssetControllerArgs, SetupIssueTokensArgs, SetupUserArgs, TransferTokensArgs, getSetupAssetControllerIxs, getSetupIssueTokensIxs, getSetupUserIxs, getTransferTokensIx, getVoidTokens, voidTokenArgs } from "../asset_controller";
import { IxReturn } from "../utils";
import { AttachPolicyArgs, getAttachPolicyAccountIx } from "../policy_engine";

/**
 * Represents the client Policy Engine for an RWA.
 */
export class PolicyEngine {
    rwaConfig: RwaConfig;
    constructor(rwaConfig: RwaConfig) {
        this.rwaConfig = rwaConfig;
    }

    /**
     * Asynchronously attaches a policy to assets.
     * @param - {@link AttachPolicyArgs}
     * @returns A Promise that resolves to the instructions to attach a policy.
     * */
    async attachPolicy(policyArgs: AttachPolicyArgs): Promise<IxReturn> {
        const attachPolicyIx = await getAttachPolicyAccountIx(policyArgs)
        return attachPolicyIx
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