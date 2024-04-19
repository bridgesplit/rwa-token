import { sendV0SolanaTransaction } from "../../scripts/helpers";
import { AttachPolicyArgs, RwaClient } from "../../src";

export async function handleMessage(
  ix: { message: string | undefined; inputValues: AttachPolicyArgs },
  rwaClient: RwaClient
): Promise<void> {
  const instructionHandlers: Record<
    string,
    (inputValues: AttachPolicyArgs) => void
  > = {
    CREATE_IDENTITY_ACCOUNT: handleCreatePolicyAccount,
    IDENTITY_APPROVAL: handleAttachPolicy,
    TRANSACTION_COUNT_VELOCITY: handleAttachPolicy,
    TRANSACTION_AMOUNT_VELOCITY: handleAttachPolicy,
    TRANSACTION_AMOUNT_LIMIT: handleAttachPolicy,
  };

  async function handleCreatePolicyAccount(
    inputValues: AttachPolicyArgs
  ): Promise<void> {
    const setupPolicyIx = await rwaClient?.policyEngine.createPolicy(
      inputValues
    );

    console.log("attempting to run createPolicy");
    try {
      const confirmed = await sendV0SolanaTransaction(
        rwaClient.provider.wallet,
        rwaClient.provider.connection,
        setupPolicyIx.ixs,
        0
      );
      if (confirmed) {
        console.log("Transaction confirmed:", confirmed);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAttachPolicy(
    inputValues: AttachPolicyArgs
  ): Promise<void> {
    const setupPolicyIx = await rwaClient?.policyEngine.attachPolicy(
      inputValues
    );
    try {
      const confirmed = await sendV0SolanaTransaction(
        rwaClient.provider.wallet,
        rwaClient.provider.connection,
        setupPolicyIx.ixs,
        0
      );
      if (confirmed) {
        console.log("Transaction confirmed:", confirmed);
      }
    } catch (err) {
      console.log(err);
    }
  }
  if (!ix.message) {
    return;
  }
  console.log(ix.message);
  const handler = instructionHandlers[ix.message];
  if (handler) {
    console.log("attempting, ", ix.message, " on ", ix.inputValues);
    handler(ix.inputValues);
  } else {
    console.log("Instruction not found in handler");
  }
}
