import { toast } from "react-toastify";
import { sendV0SolanaTransaction } from "../../scripts/helpers";
import {
  IssueTokenArgs,
  RwaClient,
  SetupAssetControllerArgs,
  VoidTokensArgs,
} from "../../src";
import { AssetControllerArgs } from "./assetController";

export function handleMessage(
  ix: { message: string; inputValues: AssetControllerArgs },
  rwaClient: RwaClient
): void {
  switch (ix.message) {
    case "SetupAssetController":
      handleSetupAssetController(
        ix.inputValues as SetupAssetControllerArgs,
        rwaClient
      );
      break;
    case "IssueTokens":
      handleIssueTokens(ix.inputValues as IssueTokenArgs, rwaClient);
      break;
    case "VoidTokens":
      handleVoidTokens(ix.inputValues as VoidTokensArgs, rwaClient);
      break;
    // case "TransferTokens":
    //   handleTransferToken(ix.inputValues as TransferTokensArgs, rwaClient);
    //   break;
    default:
      console.log("Instruction not found in handler");
      break;
  }
}

async function handleSetupAssetController(
  inputValues: SetupAssetControllerArgs,
  rwaClient: RwaClient
): Promise<void> {
  const setupIx = await rwaClient?.assetController.setupNewRegistry(
    inputValues
  );

  // VALIDATE THE TYPES

  try {
    const confirmed = await sendV0SolanaTransaction(
      rwaClient.provider.wallet,
      rwaClient.provider.connection,
      setupIx.ixs,
      0,
      setupIx.signers
    );
    if (confirmed) {
      const mint = setupIx.signers[0].publicKey.toString();
      console.log("Transaction confirmed:", confirmed);
      console.log("mint: ", mint);
      console.log(
        "data registry: ",
        rwaClient.dataRegistry.getDataRegistryPda(mint).toString()
      );
      console.log(
        "asset controller: ",
        rwaClient.assetController.getAssetControllerPda(mint).toString()
      );
      console.log(
        "policy engine: ",
        rwaClient.policyEngine.getPolicyEnginePda(mint).toString()
      );
      console.log(
        "identity registry: ",
        rwaClient.identityRegistry.getIdentityRegistryPda(mint).toString()
      );
    }
    toast.success(
      "Succesfully confirmed transaction. See console for asset data."
    );
  } catch (error) {
    console.error("Error occurred while sending transaction:", error);
    toast.error(
      "Error sending transaction, please check solscan (preflight is on)."
    );
  }
}

// Function to handle IssueTokens instruction
async function handleIssueTokens(
  inputValues: IssueTokenArgs,
  rwaClient: RwaClient
): Promise<void> {
  const issueIx = await rwaClient?.assetController.issueTokenIxns(inputValues);
  console.log("setting up user");
  try {
    const confirmed = await sendV0SolanaTransaction(
      rwaClient.provider.wallet,
      rwaClient.provider.connection,
      [issueIx],
      0
    );
    if (confirmed) {
      console.log("Transaction confirmed:", confirmed);
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to handle VoidTokens instruction
async function handleVoidTokens(
  inputValues: VoidTokensArgs,
  rwaClient: RwaClient
): Promise<void> {
  const voidIx = await rwaClient?.assetController.voidTokenIxns(inputValues);
  try {
    const confirmed = await sendV0SolanaTransaction(
      rwaClient.provider.wallet,
      rwaClient.provider.connection,
      [voidIx],
      0
    );
    if (confirmed) {
      console.log("Transaction confirmed:", confirmed);
    }
  } catch (err) {
    console.log(err);
  }
}
