
import { FormInputValues } from "../types";
import { sendV0SolanaTransaction } from "../../scripts/helpers";
import { AddLevelToIdentityAccountArgs, CreateDataAccountArgs, DelegateDataRegistryArgs, RemoveLevelFromIdentityAccount, RwaClient, SetupUserArgs, UpdateDataAccountArgs } from "../../src";



export const handleMessage = (ix: { message: string; inputValues: FormInputValues }, rwaClient: RwaClient): void => {

    //TODO: Fix any typing
    const instructionHandlers: Record<string, (inputValues: any) => void> = {
        'SetupDataAccount': handleSetupDataAccount,
        'UpdateAssetsDataAccountInfo': handleUpdateAssetDataAccountInfo,
        'DelegateDataRegistry': handleDelegateRegistry
    };

    async function handleSetupDataAccount(inputValues: CreateDataAccountArgs): Promise<void> {
        const setupIx = await rwaClient?.dataRegistry.setupDataAccount(inputValues)
        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, setupIx.ixs, 0);
            if (confirmed) {
                console.log('Transaction confirmed:', confirmed);
            }
        } catch (err) {
            console.log(err)

        }
    }

    async function handleUpdateAssetDataAccountInfo(inputValues: UpdateDataAccountArgs): Promise<void> {
        const setupIx = await rwaClient?.dataRegistry.updateAssetsDataAccountInfoIxns(inputValues)
        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, [setupIx], 0);
            if (confirmed) {
                console.log('Transaction confirmed:', confirmed);
            }
        } catch (err) {
            console.log(err)

        }
    }


    async function handleDelegateRegistry(inputValues: DelegateDataRegistryArgs): Promise<void> {
        const setupIx = await rwaClient?.dataRegistry.delegateDataRegistry(inputValues)
        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, [setupIx], 0);
            if (confirmed) {
                console.log('Transaction confirmed:', confirmed);
            }
        } catch (err) {
            console.log(err)

        }
    }

    const handler = instructionHandlers[ix.message];
    if (handler) {
        handler(ix.inputValues);

    } else {
        console.log('Instruction not found in handler')
    }
};