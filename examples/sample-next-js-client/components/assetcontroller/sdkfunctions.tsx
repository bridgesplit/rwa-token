
import { sendV0SolanaTransaction } from "../../scripts/helpers";
import { IssueTokenArgs, RwaClient, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs } from "../../src";
import { FormInputValues } from "../types";
import { AssetControllerArgs } from "./assetController";


export const handleMessage = (ix: { message: string; inputValues: AssetControllerArgs }, rwaClient: RwaClient): void => {

    // const instructionHandlers: Record<string, (inputValues: AssetControllerArgs) => Promise<void>> = {
    //     'SetupAssetController': handleSetupAssetController,
    //     'IssueTokens': handleIssueTokens,
    //     'VoidTokens': handleVoidTokens,
    //     'TransferToken': handleTransferToken,
    // };

    // Function to handle SetupAssetController instruction
    async function handleSetupAssetController(inputValues: SetupAssetControllerArgs): Promise<void> {
        const setupIx = await rwaClient?.assetController.setupNewRegistry(inputValues)
        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, setupIx.ixs, 0, setupIx.signers);
            if (confirmed) {

                const mint = setupIx.signers[0].publicKey.toString();
                console.log('Transaction confirmed:', confirmed);
                console.log('mint: ', mint);
                console.log(
                    'data registry: ',
                    rwaClient.dataRegistry.getDataRegistryPda(mint).toString(),
                );
                console.log(
                    'asset controller: ',
                    rwaClient.assetController.getAssetControllerPda(mint).toString(),
                );
                console.log(
                    'policy engine: ',
                    rwaClient.policyEngine.getPolicyEnginePda(mint).toString(),
                );
                console.log(
                    'identity registry: ',
                    rwaClient.identityRegistry.getIdentityRegistryPda(mint).toString(),
                );
            }

        } catch (error) {
            console.error('Error occurred while sending transaction:', error);
        }

    }

    // Function to handle IssueTokens instruction
    async function handleIssueTokens(inputValues: IssueTokenArgs): Promise<void> {
        const issueIx = await rwaClient?.assetController.issueTokenIxns(inputValues)
        console.log('setting up user')
        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, [issueIx], 0);
            if (confirmed) {
                console.log('Transaction confirmed:', confirmed);
            }
        } catch (err) {
            console.log(err)

        }

    }

    // Function to handle VoidTokens instruction
    async function handleVoidTokens(inputValues: VoidTokensArgs): Promise<void> {
        const voidIx = await rwaClient?.assetController.voidTokenIxns(inputValues)
        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, [voidIx], 0);
            if (confirmed) {
                console.log('Transaction confirmed:', confirmed);
            }
        } catch (err) {
            console.log(err)

        }
    }

    // Function to handle TransferToken instruction
    async function handleTransferToken(inputValues: TransferTokensArgs): Promise<void> {
        // TODO: Complete last
    }

    // const handler = instructionHandlers[ix.message];
    // if (handler) {
    //     handler(ix.inputValues);

    // } else {
    //     console.log('Instruction not found in handler')
    // }
};
