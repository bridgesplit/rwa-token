import { type PublicKey, type TransactionInstruction } from '@solana/web3.js';
import {
	type IssueTokenArgs,
	type SetupAssetControllerArgs,
	type TransferTokensArgs,
	type VoidTokensArgs,
	getIssueTokensIx,
	getSetupAssetControllerIxs,
	getTransferTokensIx,
	getVoidTokensIx,
	getAssetControllerPda,
	getTrackerAccountPda,
	getExtraMetasListPda,
} from '../asset_controller';
import { type IxReturn } from '../utils';
import { type RwaClient } from './rwa';

/**
 * Represents the client for Asset Controller for an RWA.
 *
 * Missing functions: Freeze token, unfreeze tokens
 */
export class AssetController {
	private readonly rwaClient: RwaClient;

	constructor(rwaClient: RwaClient) {
		this.rwaClient = rwaClient;
	}

	/**
   * Asynchronously generates instructions to setup a new asset controller.
   * @param - {@link SetupAssetControllerArgs}
   * @returns A Promise that resolves to the instructions to create an asset controller.
   */
	async setupNewRegistry(
		createAssetControllerArgs: SetupAssetControllerArgs,
	): Promise<IxReturn> {
		const setupControllerIx = await getSetupAssetControllerIxs(
			createAssetControllerArgs,
			this.rwaClient.provider,
		);

		return setupControllerIx;
	}

	/**
   * Asynchronously generates instructions to issue tokens.
   * @param - {@link IssueTokenArgs}
   * @returns A Promise that resolves to the instructions to issue tokens.
   */
	async issueTokenIxns(
		IssueArgs: IssueTokenArgs,
	): Promise<TransactionInstruction> {
		const issueTokensIx = await getIssueTokensIx(
			IssueArgs,
			this.rwaClient.provider,
		);
		return issueTokensIx;
	}

	/**
   * Asynchronously generates instructions to revoke assets.
   * @param - {@link VoidTokensArgs}
   * @returns A Promise that resolves to the instructions to revoke assets.
   */
	async voidTokenIxns(
		voidTokenArgs: VoidTokensArgs,
	): Promise<TransactionInstruction> {
		const voidTokenIx = await getVoidTokensIx(
			voidTokenArgs,
			this.rwaClient.provider,
		);
		return voidTokenIx;
	}

	/**
   * Executes a token transfer.
   * @returns A promise that resolves to transaction instruction.
   */
	async transfer(
		transferArgs: TransferTokensArgs,
	): Promise<TransactionInstruction> {
		const transferIx = await getTransferTokensIx(transferArgs);
		return transferIx;
	}

	/**
   * Retrieves the asset controller pda account for a specific asset mint.
   * @param assetMint - The string representation of the asset's mint address.
   * @returns The asset controllers pda as a public key.
   */
	getAssetControllerPda(assetMint: string): PublicKey {
		return getAssetControllerPda(assetMint);
	}

	/**
   * Retrieves the asset controller's metadata pda account for a specific asset mint.
   * @param assetMint - The string representation of the asset's mint address.
   * @returns The asset controller's extra metadata pda.
   */
	getExtraMetasListPda(assetMint: string): PublicKey {
		return getExtraMetasListPda(assetMint);
	}

	/**
   * Retrieves the tracker pda for a specific asset controller mint and owner.
   * Tracks the transfers happening from user account. Important for enforcing policies.
   * @param assetMint - The string representation of the asset's mint address.
   * @param owner - The string representation of asset's owner.
   * @returns The asset controller's tracker pda.
   */
	getTrackerAccountPda(assetMint: string, owner: string): PublicKey {
		return getTrackerAccountPda(assetMint, owner);
	}
}
