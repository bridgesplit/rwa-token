export interface TransactionApprovalAccount {
    assetMint: string;
    slot: number;
    fromTokenAccount?: string;
    toTokenAccount?: string;
    amount?: number;
}

export interface AssetControllerAccount {
    version: number;
    assetMint: string;
    authority: string;
    delegate: string;
}

export interface TrackerAccount {
    version: number;
    assetMint: string;
    owner: string;
    transferAmounts: Array<number>;
    transferTimestamps: Array<number>;
}