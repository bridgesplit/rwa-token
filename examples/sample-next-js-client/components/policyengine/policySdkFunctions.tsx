
import { FormInputValues } from "../types";
import { sendV0SolanaTransaction } from "../../scripts/helpers";
import { AttachPolicyArgs, RwaClient } from "../../src";

export const handleMessage = (inputValues: AttachPolicyArgs, rwaClient: RwaClient): void => {
    handleAttachPolicy(inputValues, rwaClient);
};

async function handleAttachPolicy(inputValues: AttachPolicyArgs, rwaClient: RwaClient): Promise<void> {
    console.log(inputValues, 'submitting torwa client')
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