import { TransactionInstruction } from "@solana/web3.js";
import { IssueTokenArgs, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs, getIssueTokensIx, getSetupAssetControllerIxs, getTransferTokensIx, getVoidTokensIx } from "../asset_controller";
import { IxReturn } from "../utils";
import { RwaClient } from "./rwa";

/**
 * Represents the client for Asset Controller for an RWA.
 */
export class AssetController {
    private rwaClient: RwaClient;

    constructor(rwaClient: RwaClient) {
        this.rwaClient = rwaClient;
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
            this.rwaClient.provider
        );

        return setupControllerIx
    }

    /**
     * Asynchronously generates instructions to issue tokens.
     * @returns A Promise that resolves to the instructions to issue tokens.
     */
    async issueTokenIxns(IssueArgs: IssueTokenArgs): Promise<TransactionInstruction> {
        const issueTokensIx = await getIssueTokensIx(
            IssueArgs,
            this.rwaClient.provider
        )
        return issueTokensIx
    }

    /**
     * Asynchronously generates instructions to update the asset controller delegate.
     * @returns A Promise that resolves to the instructions to update the delegate.
     */
    // TODO: Missing instructions
    async updateAssetControllerDelgateIxns(): Promise<IxReturn> {
        return {
            ixs: [],
            signers: []
        };
    }


    /**
     * Asynchronously generates instructions to revoke assets.
     * @returns A Promise that resolves to the instructions to revoke assets.
     */
    async voidTokenIxns(voidTokenArgs: VoidTokensArgs): Promise<TransactionInstruction> {
        const voidTokenIx = await getVoidTokensIx(
            voidTokenArgs,
            this.rwaClient.provider
        )
        return voidTokenIx
    }

    /**
     * Simulates a fake transfer based on user account parameters.
     * @returns A Promise that resolves to a boolean indicating the success of the simulation.
     */
    //TODO: Spec out. Determine if this is useful.
    async simulateFakeTransfer(): Promise<boolean> {
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
}