import { IxReturn } from "../utils";
import { AttachPolicyArgs, getAttachPolicyAccountIx } from "../policy_engine";
import { RwaClient } from "./rwa";

/**
 * Represents the client Policy Engine for an RWA.
 */
export class PolicyEngine {
  private rwaClient: RwaClient;

  constructor(rwaClient: RwaClient) {
    this.rwaClient = rwaClient;
  }

  /**
   * Asynchronously attaches a policy to assets.
   * @param - {@link AttachPolicyArgs}
   * @returns A Promise that resolves to the instructions to attach a policy.
   * */
  async attachPolicy(policyArgs: AttachPolicyArgs): Promise<IxReturn> {
    const attachPolicyIx = await getAttachPolicyAccountIx(
      policyArgs,
      this.rwaClient.provider
    );
    return attachPolicyIx;
  }
}
