import { TransactionInstruction } from "@solana/web3.js";
import { SetupUserArgs, getSetupUserIxs } from "../asset_controller";
import { IxReturn } from "../utils";
import { AddLevelToIdentityAccountArgs, RemoveLevelFromIdentityAccount, getAddLevelToIdentityAccount, getRemoveLevelFromIdentityAccount } from "../identity_registry";

/**
 * Represents the client for Identity Registry for an RWA.
 */
export class IdentityRegistry {
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
    * Asynchronously update user account identity
    * @returns A Promise that resolves to the instructions to update user account identity.
    * */
    async addIdentityLevelToUserAccount(addLevelArgs: AddLevelToIdentityAccountArgs): Promise<TransactionInstruction> {
        const addLevelIx = await getAddLevelToIdentityAccount(addLevelArgs)
        return addLevelIx

    }

    /**
     * Asynchronously reduces a user identity account level
     * @returns A Promise that resolves to the instructions to reduce the level of a user identity account.
     */
    async removeIdentityLevelFromUserAccount(removeLevelArgs: RemoveLevelFromIdentityAccount): Promise<TransactionInstruction> {
        const reduceLevelIx = await getRemoveLevelFromIdentityAccount(removeLevelArgs)
        return reduceLevelIx
    }
}