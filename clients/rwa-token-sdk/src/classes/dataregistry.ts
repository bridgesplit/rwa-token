import {type PublicKey, type TransactionInstruction} from '@solana/web3.js';
import {type IxReturn} from '../utils';
import {
	type CreateDataAccountArgs,
	type DelegateDataRegistryArgs,
	type UpdateDataAccountArgs,
	getCreateDataAccountIx,
	getDelegateDataRegistryIx,
	getUpdateDataAccountIx,
	getDataRegistryPda,
} from '../data_registry';
import {type RwaClient} from './rwa';

/**
 * Represents the client for Data Registry for an RWA.
 */
export class DataRegistry {
	// eslint-disable-next-line @typescript-eslint/parameter-properties
	private readonly rwaClient: RwaClient;

	constructor(rwaClient: RwaClient) {
		this.rwaClient = rwaClient;
	}

	/**
   * Asynchronously generates instructions to update asset information.
   * @returns A Promise that resolves to the instructions to update asset information.
   */
	async setupDataAccount(
		createDataAccountArgs: CreateDataAccountArgs,
	): Promise<IxReturn> {
		const createDataAccountIx = await getCreateDataAccountIx(
			createDataAccountArgs,
			this.rwaClient.provider,
		);
		return createDataAccountIx;
	}

	/**
   * Asynchronously generates instructions to update asset information.
   * @returns A Promise that resolves to the instructions to update asset information.
   */
	async updateAssetsDataAccountInfoIxns(
		updateArgs: UpdateDataAccountArgs,
	): Promise<TransactionInstruction> {
		const updateIx = await getUpdateDataAccountIx(
			updateArgs,
			this.rwaClient.provider,
		);
		return updateIx;
	}

	/**
   * Asynchronously generates instructions to update asset information.
   * @returns A Promise that resolves to the instructions to update asset information.
   */
	async delegateDataRegistry(
		delegateDataRegistryArgs: DelegateDataRegistryArgs,
	): Promise<TransactionInstruction> {
		const delegateIx = await getDelegateDataRegistryIx(
			delegateDataRegistryArgs,
			this.rwaClient.provider,
		);
		return delegateIx;
	}

	/**
   * Retrieves the data registry pda account for a specific asset mint.
   * @param assetMint - The string representation of the asset's mint address.
   * @returns The data registry pda as a public key.
   */
	getDataRegistryPda(assetMint: string): PublicKey {
		return getDataRegistryPda(assetMint);
	}
}
