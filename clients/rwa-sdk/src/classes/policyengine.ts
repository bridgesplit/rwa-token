import { ConfirmOptions, Connection } from "@solana/web3.js";
import { IxReturn } from "../utils";
import { AttachPolicyArgs, getAttachPolicyAccountIx } from "../policy_engine";

/**
 * Represents the client Policy Engine for an RWA.
 */
export class PolicyEngine {
    /**
     * Asynchronously attaches a policy to assets.
     * @param - {@link AttachPolicyArgs}
     * @returns A Promise that resolves to the instructions to attach a policy.
     * */
    async attachPolicy(policyArgs: AttachPolicyArgs): Promise<IxReturn> {
        const attachPolicyIx = await getAttachPolicyAccountIx(policyArgs)
        return attachPolicyIx
    }
}