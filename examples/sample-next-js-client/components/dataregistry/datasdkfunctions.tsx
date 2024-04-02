import { sendV0SolanaTransaction } from "../../scripts/helpers";
import { CreateDataAccountArgs, DelegateDataRegistryArgs, RwaClient, UpdateDataAccountArgs } from "../../src";
import { DataRegistryArgs } from "./dataregistry";


export function handleMessage(ix: { message: string; inputValues: DataRegistryArgs }, rwaClient: RwaClient): void {
    switch (ix.message) {
        case 'SetupDataAccount':
            handleSetupDataAccount(ix.inputValues as CreateDataAccountArgs, rwaClient);
            break;
        case 'UpdateAssetsDataAccountInfo':
            handleUpdateAssetDataAccountInfo(ix.inputValues as UpdateDataAccountArgs, rwaClient);
            break;
        case 'DelegateDataRegistry':
            handleDelegateRegistry(ix.inputValues as DelegateDataRegistryArgs, rwaClient);
            break;
        default:
            console.log('Instruction not found in handler');
            break;
    }
};

async function handleSetupDataAccount(inputValues: CreateDataAccountArgs, rwaClient: RwaClient): Promise<void> {
    console.log('running setup')
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

async function handleUpdateAssetDataAccountInfo(inputValues: UpdateDataAccountArgs, rwaClient: RwaClient): Promise<void> {
    console.log('running update')

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


async function handleDelegateRegistry(inputValues: DelegateDataRegistryArgs, rwaClient: RwaClient): Promise<void> {
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
