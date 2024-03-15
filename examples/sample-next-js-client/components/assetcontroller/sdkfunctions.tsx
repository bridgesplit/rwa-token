import { IssueTokenArgs, RwaClient, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs } from "@/src";
import { FormInputValues } from "./types";
import { Connection, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { sendV0SolanaTransaction } from "@/scripts/helpers";
import { AnchorWallet } from "@solana/wallet-adapter-react";


export const handleMessage = (ix: { message: string; inputValues: FormInputValues }, rwaClient: RwaClient): void => {

    //TODO: Fix any typing
    const instructionHandlers: Record<string, (inputValues: any) => void> = {
        'SetupAssetController': handleSetupAssetController,
        'IssueTokens': handleIssueTokens,
        'VoidTokens': handleVoidTokens,
        'TransferToken': handleTransferToken,
    };

    // Function to handle SetupAssetController instruction
    async function handleSetupAssetController(inputValues: SetupAssetControllerArgs): Promise<void> {
        console.log(inputValues)
        console.log('setting up controller')

        const setupIx = await rwaClient?.assetController.setupNewRegistry(inputValues)
        // const txnId = await sendAndConfirmTransaction(
        //     rwaClient.provider.connection,
        //     new Transaction().add(...ix.ixs),
        //     [ix.payerKp, ...ix.signers],
        // );

        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, setupIx.ixs, 0);
            if (confirmed) {
                console.log('Transaction confirmed:', confirmed);

                const mint = setupIx.signers[0].publicKey.toString();

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
    function handleIssueTokens(inputValues: IssueTokenArgs): void {
        // Execute instructions for issuing tokens
        console.log(inputValues)
        console.log('issuing tokens')


    }

    // Function to handle VoidTokens instruction
    function handleVoidTokens(inputValues: VoidTokensArgs): void {
        // Execute instructions for voiding tokens
        console.log(inputValues)
        console.log('handling void tokens')
    }

    // Function to handle TransferToken instruction
    function handleTransferToken(inputValues: TransferTokensArgs): void {
        console.log(inputValues)
        console.log('handling transfer')
    }

    const handler = instructionHandlers[ix.message];
    if (handler) {
        handler(ix.inputValues);
    } else {
        console.log('Instruction not found in handler')
    }
};