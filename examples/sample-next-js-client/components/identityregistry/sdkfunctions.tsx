
import { FormInputValues } from "../types";
import { sendV0SolanaTransaction } from "../../scripts/helpers";
import { AddLevelToIdentityAccountArgs, RemoveLevelFromIdentityAccount, RwaClient, SetupUserArgs } from "../../src";



export const handleMessage = (ix: { message: string; inputValues: FormInputValues }, rwaClient: RwaClient): void => {

    //TODO: Fix any typing
    const instructionHandlers: Record<string, (inputValues: any) => void> = {
        'SetupUser': handleSetupUser,
        'AddIdentityLevelTouser': handleAddIdentityLevelToUserAccount,
        'RemoveLevelFromUserAccount': handleRemoveLevelFromUserAccount,
    };

    async function handleSetupUser(inputValues: SetupUserArgs): Promise<void> {
        // OWNER is the identity registry
        const setupIx = await rwaClient?.identityRegistry.setupUserIxns(inputValues)

        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, setupIx.ixs, 0);
            if (confirmed) {
                console.log('Transaction confirmed:', confirmed);
            }
        } catch (err) {
            console.log(err)

        }

    }
    async function handleAddIdentityLevelToUserAccount(inputValues: AddLevelToIdentityAccountArgs): Promise<void> {

    }
    async function handleRemoveLevelFromUserAccount(inputValues: RemoveLevelFromIdentityAccount): Promise<void> {

    }


    const handler = instructionHandlers[ix.message];
    if (handler) {
        handler(ix.inputValues);

    } else {
        console.log('Instruction not found in handler')
    }
};