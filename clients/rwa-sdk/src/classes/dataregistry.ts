import { type TransactionInstruction } from "@solana/web3.js";
import { type IxReturn } from "../utils";
import {
  type CreateDataAccountArgs,
  type DelegateDataRegistryArgs,
  type UpdateDataAccountArgs,
  getCreateDataAccountIx,
  getDelegateDataRegistryIx,
  getUpdateDataAccountIx,
} from "../data_registry";
import { type RwaClient } from "./rwa";

/**
 * Represents the client for Data Registry for an RWA.
 */
export class DataRegistry {
  private readonly rwaClient: RwaClient;

  constructor(rwaClient: RwaClient) {
    this.rwaClient = rwaClient;
  }

  /**
   * Asynchronously generates instructions to update asset information.
   * @returns A Promise that resolves to the instructions to update asset information.
   */
  async setupDataAccount(
    createDataAccountArgs: CreateDataAccountArgs
  ): Promise<IxReturn> {
    const createDataAccountIx = await getCreateDataAccountIx(
      createDataAccountArgs,
      this.rwaClient.provider
    );
    return createDataAccountIx;
  }

  /**
   * Asynchronously generates instructions to update asset information.
   * @returns A Promise that resolves to the instructions to update asset information.
   */
  async updateAssetsDataAccountInfoIxns(
    updateArgs: UpdateDataAccountArgs
  ): Promise<TransactionInstruction> {
    const updateIx = await getUpdateDataAccountIx(
      updateArgs,
      this.rwaClient.provider
    );
    return updateIx;
  }

  /**
   * Asynchronously generates instructions to update asset information.
   * @returns A Promise that resolves to the instructions to update asset information.
   */
  async delegateDataRegistry(
    delegateDataRegistryArgs: DelegateDataRegistryArgs
  ): Promise<TransactionInstruction> {
    const delegateIx = await getDelegateDataRegistryIx(
      delegateDataRegistryArgs,
      this.rwaClient.provider
    );
    return delegateIx;
  }
}
