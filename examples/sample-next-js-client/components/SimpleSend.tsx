import { useWallet } from "@solana/wallet-adapter-react";
import {
  AddLevelToIdentityAccountArgs,
  AttachPolicyArgs,
  IssueTokenArgs,
  RemoveLevelFromIdentityAccountArgs,
  SetupAssetControllerArgs,
  SetupUserArgs,
  TransferTokensArgs,
  VoidTokensArgs,
} from "../src";
import { useRwaClient } from "../hooks/useRwaClient";
import { Transaction, TransactionMessage, VersionedTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { sign } from "crypto";
import { confirmSignatureStatus } from "../scripts/helpers";

export default function SimpleSend() {
  const wallet = useWallet();
  const { rwaClient, status } = useRwaClient();

  const SetupAssetController = async () => {

    if (rwaClient && wallet.publicKey) {
      const walletPub = wallet.publicKey.toString();
      const SetupAssetControllerArgs = {
        decimals: 6,
        payer: walletPub,
        authority: walletPub,
        name: "Name",
        uri: "TestHomebase",
        symbol: "HBASE",
      };

      const setupIx = await rwaClient?.assetController.setupNewRegistry(
        SetupAssetControllerArgs as SetupAssetControllerArgs
      );

      try {
        // Fetch recent blockhash
        const blockhashResponse = await rwaClient.provider.connection.getLatestBlockhashAndContext(
          "finalized"
        );
        const recentBlockhash = blockhashResponse.value.blockhash
        const lastValidHeight = blockhashResponse.value.lastValidBlockHeight;

        // Construct transaction with recent blockhash
        const messageV0 = new TransactionMessage({
          payerKey: wallet.publicKey!,
          recentBlockhash: blockhashResponse.value.blockhash,
          instructions: setupIx.ixs,
        }).compileToV0Message();
        
        const transaction = new VersionedTransaction(messageV0);
        const signedTx = await wallet.signTransaction?.(transaction);

        if(signedTx && setupIx.signers){
          signedTx?.sign(...[setupIx.signers])
        }

        const signature = await rwaClient.config.connection.sendRawTransaction(
          signedTx?.serialize()!,
          { skipPreflight: true }
        );

        let confirmed = false;
        confirmed = await confirmSignatureStatus(
          signature,
          rwaClient.config.connection,
          lastValidHeight
        );

    } catch (error) {
        console.log(error);
    }

    }
  };
  return (
    <div className="w-[700px]">
      <h1 className="text-black font-bold text-[24px]">Simple Send</h1>
      <button onClick={SetupAssetController}>SEND</button>
    </div>
  );
}
