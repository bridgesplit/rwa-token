import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js"

export type RwaConfig = {
    connection: Connection;
    rpcUrl: string;
    confirmationOptions: ConfirmOptions;
};

export type AssetInfo = {
    mint: string
};