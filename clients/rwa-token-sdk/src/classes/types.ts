import { type ConfirmOptions, type Connection } from "@solana/web3.js";

//** Configuration type for the RWA client. */
export type Config = {
  connection: Connection;
  rpcUrl: string;
  confirmationOptions: ConfirmOptions;
};

//** Arguments to store an asset's mints. */
export type AssetInfo = {
  mint: string;
};
