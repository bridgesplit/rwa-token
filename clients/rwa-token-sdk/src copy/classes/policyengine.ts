import {type IxReturn} from "../utils";
import {
	type AttachPolicyArgs,
	getAttachToPolicyAccountIx,
	getCreatePolicyAccountIx,
	getPolicyEnginePda,
} from "../policyEngine";
import {type RwaClient} from "./client";
import {type PublicKey} from "@solana/web3.js";

/**
 * Represents the client Policy Engine for an RWA.
 *
 * TODO: Missing remove policy.
 */
export class PolicyEngine {
	// eslint-disable-next-line @typescript-eslint/parameter-properties
	private readonly rwaClient: RwaClient;

	constructor(rwaClient: RwaClient) {
		this.rwaClient = rwaClient;
	}

	/**
   * Asynchronously create a policy account to assets.
   * @param - {@link AttachPolicyArgs}
   * @returns A Promise that resolves to the instructions to attach a policy.
   * */
	async createPolicy(policyArgs: AttachPolicyArgs): Promise<IxReturn> {
		const createPolicyIx = await getCreatePolicyAccountIx(
			policyArgs,
			this.rwaClient.provider,
		);
		return createPolicyIx;
	}
	

	/**
   * Asynchronously attaches a policy to the policy account.
   * @param - {@link AttachPolicyArgs}
   * @returns A Promise that resolves to the instructions to attach a policy.
   * */
	async attachPolicy(policyArgs: AttachPolicyArgs): Promise<IxReturn> {
		const attachPolicyIx = await getAttachToPolicyAccountIx(
			policyArgs,
			this.rwaClient.provider,
		);
		return attachPolicyIx;
	}

	/**
   * Retrieves the policy registry pda account for a specific asset mint.
   * @param assetMint - The string representation of the asset's mint address.
   * @returns The policy registry pda as a public key.
   */
	getPolicyEnginePda(assetMint: string): PublicKey {
		return getPolicyEnginePda(assetMint);
	}
}
