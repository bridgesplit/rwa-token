
import { FormInputValues } from "../types";
import { sendV0SolanaTransaction } from "../../scripts/helpers";
import { AttachPolicyArgs, RwaClient } from "../../src";




export const handleMessage = <T,>(ix: { message: string; inputValues: T }, rwaClient: RwaClient): void => {

    //TODO: Fix any typing
    const instructionHandlers: Record<string, (inputValues: any) => void> = {
        'IdentityApprovalPolicy': handleAttachPolicy,
        'TransactionCountVelocity': handleAttachPolicy,
        'TransactionAmountVelocity': handleAttachPolicy,
        'TransactionAmountLimitPolicy': handleAttachPolicy,

    };

    async function handleAttachPolicy(inputValues: AttachPolicyArgs): Promise<void> {
        const setupPolicyIx = await rwaClient?.policyEngine.attachPolicy(inputValues)
        try {
            const confirmed = await sendV0SolanaTransaction(rwaClient.provider.wallet, rwaClient.provider.connection, setupPolicyIx.ixs, 0);
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