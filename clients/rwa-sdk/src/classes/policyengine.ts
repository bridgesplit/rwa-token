import { type IxReturn } from "../../../rwa-token-sdk/src/utils";
import {
  type AttachPolicyArgs,
  getAttachPolicyAccountIx,
} from "../../../rwa-token-sdk/src/policy_engine";
import { type RwaClient } from "./rwa";

/**
 * Represents the client Policy Engine for an RWA.
 */
export class PolicyEngine {
  private readonly rwaClient: RwaClient;

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
