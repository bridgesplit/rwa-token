import { sendV0SolanaTransaction } from "../../scripts/helpers";
import {
  AddLevelToIdentityAccountArgs,
  RemoveLevelFromIdentityAccountArgs,
  RwaClient,
  SetupUserArgs,
} from "../../src";
import { IdentityRegistryArgs } from "./identityRegistry";

export const handleMessage = (
  ix: { message: string; inputValues: IdentityRegistryArgs },
  rwaClient: RwaClient
): void => {
  const instructionHandlers: Record<
    string,
    (inputValues: IdentityRegistryArgs) => void
  > = {
    SetupUser: handleSetupUser,
    AddIdentityLevelToUser: handleAddIdentityLevelToUserAccount,
    RemoveLevelFromUser: handleRemoveLevelFromUserAccount,
  };

  async function handleSetupUser(inputValues: SetupUserArgs): Promise<void> {
    const setupIx = await rwaClient?.identityRegistry.setupUserIxns(
      inputValues
    );
    try {
      const confirmed = await sendV0SolanaTransaction(
        rwaClient.provider.wallet,
        rwaClient.provider.connection,
        setupIx.ixs,
        0
      );
      if (confirmed) {
        console.log("Transaction confirmed:", confirmed);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function handleAddIdentityLevelToUserAccount(
    inputValues: AddLevelToIdentityAccountArgs
  ): Promise<void> {
    console.log("wagababga on ", inputValues);
    const addLevelIx =
      await rwaClient?.identityRegistry.addIdentityLevelToUserAccount(
        inputValues
      );
    try {
      const confirmed = await sendV0SolanaTransaction(
        rwaClient.provider.wallet,
        rwaClient.provider.connection,
        [addLevelIx],
        0
      );
      if (confirmed) {
        console.log("Transaction confirmed:", confirmed);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function handleRemoveLevelFromUserAccount(
    inputValues: RemoveLevelFromIdentityAccountArgs
  ): Promise<void> {
    const removeLevelIx =
      await rwaClient?.identityRegistry.removeIdentityLevelFromUserAccount(
        inputValues
      );
    try {
      const confirmed = await sendV0SolanaTransaction(
        rwaClient.provider.wallet,
        rwaClient.provider.connection,
        [removeLevelIx],
        0
      );
      if (confirmed) {
        console.log("Transaction confirmed:", confirmed);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handler = instructionHandlers[ix.message];
  if (handler) {
    console.log("attempting, ", ix.message, " on ", ix.inputValues);
    handler(ix.inputValues);
  } else {
    console.log("Instruction not found in handler");
  }
};
