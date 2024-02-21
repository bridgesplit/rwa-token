import { getProvider } from "../utils";
import { AssetControllerAccount, TrackerAccount, TransactionApprovalAccount } from "./types";
import { getAssetControllerPda, getAssetControllerProgram, getTransactionApprovalAccountPda } from "./utils";

export async function getTransactionApprovalAccount(assetMint: string): Promise<TransactionApprovalAccount | undefined> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const transactionApprovalAccount = getTransactionApprovalAccountPda(assetMint);
    return assetProgram.account.transactionApprovalAccount.fetch(transactionApprovalAccount)
        .then(account => {
            return account;
        })
        .catch(() => {
            return undefined;
        });
}

export async function getAssetControllerAccount(assetMint: string): Promise<AssetControllerAccount | undefined> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const assetControllerPda = getAssetControllerPda(assetMint);
    return assetProgram.account.assetControllerAccount.fetch(assetControllerPda)
        .then(account => {
            return account;
        })
        .catch(() => {
            return undefined;
        });
}

export async function getTrackerAccount(assetMint: string): Promise<TrackerAccount | undefined> {
    const provider = getProvider();
    const assetProgram = getAssetControllerProgram(provider);
    const trackerPda = getAssetControllerPda(assetMint);
    return assetProgram.account.trackerAccount.fetch(trackerPda)
        .then(account => {
            return account;
        })
        .catch(() => {
            return undefined;
        });
}