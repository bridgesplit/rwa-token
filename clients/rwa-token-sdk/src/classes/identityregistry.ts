import {type PublicKey, type TransactionInstruction} from "@solana/web3.js";
import {type SetupUserArgs, getSetupUserIxs} from "../assetController";
import {type IxReturn} from "../utils";
import {
	type AddLevelToIdentityAccountArgs,
	type RemoveLevelFromIdentityAccountArgs,
	getAddLevelToIdentityAccount,
	getRemoveLevelFromIdentityAccount,
	getIdentityRegistryPda,
	getIdentityAccountPda,
} from "../identityRegistry";
import {type RwaClient} from "./client";

/**
 * Represents the client for Identity Registry for an RWA.
 */
export class IdentityRegistry {
	// eslint-disable-next-line @typescript-eslint/parameter-properties
	private readonly rwaClient: RwaClient;

	constructor(rwaClient: RwaClient) {
		this.rwaClient = rwaClient;
	}

	/**
   * Asynchronously generates instructions to setup a user.
   * @param - {@link SetupUserArgs}
   * @returns A Promise that resolves to the instructions to setup a user.
   *
   * It is required for at least a single user to be setup before issuing tokens.
   */
	async setupUserIxns(setupUserArgs: SetupUserArgs): Promise<IxReturn> {
		const setupUserIx = await getSetupUserIxs(
			setupUserArgs,
			this.rwaClient.provider,
		);
		return setupUserIx;
	}

	/**
   * Asynchronously update user account identity
   * @param - {@link AddLevelToIdentityAccountArgs}
   * @returns A Promise that resolves to the instructions to update user account identity.
   * */
	async addIdentityLevelToUserAccount(
		addLevelArgs: AddLevelToIdentityAccountArgs,
	): Promise<TransactionInstruction> {
		const addLevelIx = await getAddLevelToIdentityAccount(
			addLevelArgs,
			this.rwaClient.provider,
		);
		return addLevelIx;
	}

	/**
   * Asynchronously reduces a user identity account level
   * @param - {@link RemoveLevelFromIdentityAccount}
   * @returns A Promise that resolves to the instructions to reduce the level of a user identity account.
   */
	async removeIdentityLevelFromUserAccount(
		removeLevelArgs: RemoveLevelFromIdentityAccountArgs,
	): Promise<TransactionInstruction> {
		const reduceLevelIx = await getRemoveLevelFromIdentityAccount(
			removeLevelArgs,
			this.rwaClient.provider,
		);
		return reduceLevelIx;
	}

	/**
   * Retrieves the identity registry pda account for a specific asset mint.
   * @param assetMint - The string representation of the asset's mint address.
   * @returns The identity registry pda as a public key.
   */
	getIdentityRegistryPda(assetMint: string): PublicKey {
		return getIdentityRegistryPda(assetMint);
	}

	/**
   * Retrieves the identity account pda public key for a specific asset mint.
   * @param assetMint - The string representation of the asset's mint address.
   * @param owner - The string representation of the asset's owner.
   * @returns The identity account pda.
   */
	getIdentityAccountPda(assetMint: string, owner: string): PublicKey {
		return getIdentityAccountPda(assetMint, owner);
	}
}
