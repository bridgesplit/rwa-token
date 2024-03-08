import { ConfirmOptions, Connection, Keypair, TransactionInstruction } from "@solana/web3.js";
import { RwaConfig } from "./types"
import { SetupAssetControllerArgs, SetupIssueTokensArgs, SetupUserArgs, TransferTokensArgs, getSetupAssetControllerIxs, getSetupIssueTokensIxs, getSetupUserIxs, getTransferTokensIx, getVoidTokens, voidTokenArgs } from "../asset_controller";
import { IxReturn } from "../utils";
import { AttachPolicyArgs, getAttachPolicyAccountIx } from "../policy_engine";
import { AddLevelToIdentityAccountArgs, RemoveLevelFromIdentityAccount, getAddLevelToIdentityAccount, getRemoveLevelFromIdentityAccount } from "../identity_registry";

/**
 * Represents the client for Asset Controller for an RWA.
 */
export class AssetController {
    rwaConfig: RwaConfig;

    /**
     * Constructs a new instance of RwaConfigManager.
     * @param {RwaConfig} rwaConfig - The RWA configuration object.
     */
    constructor(rwaConfig: RwaConfig) {
        this.rwaConfig = rwaConfig;
    }

    /**
     * Asynchronously generates instructions to setup a new asset controller.
     * @returns A Promise that resolves to the instructions to create an asset controller.
     */
    async setUpNewRegistry(
        createAssetControllerArgs: SetupAssetControllerArgs
    ): Promise<IxReturn> {
        const setupControllerIx = await getSetupAssetControllerIxs(
            createAssetControllerArgs,
        );

        return setupControllerIx
    }

    /**
     * Asynchronously generates instructions to setup a user.
     * @param - {@link SetupUserArgs}
     * @returns A Promise that resolves to the instructions to setup a user.
     *
     * It is required for at least a single user to be setup before issuing tokens.
     */
    async setupUserIxns(setupUserArgs: SetupUserArgs): Promise<IxReturn> {
        const setupUserIx = await getSetupUserIxs(setupUserArgs)
        return setupUserIx
    }

    /**
     * Asynchronously generates instructions to issue tokens.
     * @returns A Promise that resolves to the instructions to issue tokens.
     */
    async issueTokenIxns(setupIssueArgs: SetupIssueTokensArgs): Promise<IxReturn> {
        // Should this include seperate e.g setupuser & issuetokens?
        const issueTokensIx = await getSetupIssueTokensIxs(
            setupIssueArgs
        )
        return issueTokensIx
    }

    /**
     * Asynchronously attaches a policy to assets.
     * @param - {@link AttachPolicyArgs}
     * @returns A Promise that resolves to the instructions to attach a policy.
     */
    async attachPolicy(policyArgs: AttachPolicyArgs): Promise<IxReturn> {
        const attachPolicyIx = await getAttachPolicyAccountIx(policyArgs)
        return attachPolicyIx
    }

    /**
     * Asynchronously generates instructions to update the asset controller delegate.
     * @returns A Promise that resolves to the instructions to update the delegate.
     */
    async updateAssetControllerDelgateIxns(): Promise<IxReturn> {

        // TODO: Missing instrunctions
        return {
            ixs: [],
            signers: []
        };
    }

    /**
     * Asynchronously generates instructions to update asset information.
     * @returns A Promise that resolves to the instructions to update asset information.
     */
    async updateAssetsDataRegistryInfoIxns(): Promise<IxReturn> {

        //TODO: Missing instructions maybe rename to updateDataRegistry
        return {
            ixs: [],
            signers: []
        };
    }

    /**
     * Asynchronously generates instructions to revoke assets.
     * @returns A Promise that resolves to the instructions to revoke assets.
     */
    async voidTokenIxns(voidTokenArgs: voidTokenArgs): Promise<IxReturn> {
        const voidTokenIx = await getVoidTokens(voidTokenArgs)
        return voidTokenIx
    }

    /**
     * Simulates a fake transfer based on user account parameters.
     * @returns A Promise that resolves to a boolean indicating the success of the simulation.
     */
    async simulateFakeTransfer(): Promise<boolean> {
        //TODO: Spec out. Determine if this is useful.
        return true
    }

    /**
     * Simulates a fake transfer based on user account parameters.
     * @returns A Promise that resolves to a boolean indicating the success of the simulation.
     */
    async transfer(transferArgs: TransferTokensArgs): Promise<TransactionInstruction> {
        const transferIx = await getTransferTokensIx(transferArgs)
        return transferIx
    }


    /**
     * Asynchronously update user account identity
     * @returns A Promise that resolves to the instructions to update user account identity.
     */
    async upgradeUserAccount(addLevelArgs: AddLevelToIdentityAccountArgs): Promise<TransactionInstruction> {
        const addLevelIx = await getAddLevelToIdentityAccount(addLevelArgs)
        return addLevelIx

    }

    /**
     * Asynchronously reduces a user identity account level
     * @returns A Promise that resolves to the instructions to reduce the level of a user identity account.
     */
    async reduceUserAccount(removeLevelArgs: RemoveLevelFromIdentityAccount): Promise<TransactionInstruction> {
        const reduceLevelIx = await getRemoveLevelFromIdentityAccount(removeLevelArgs)
        return reduceLevelIx
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