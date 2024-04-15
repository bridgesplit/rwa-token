import {type ConfirmOptions, type Connection} from "@solana/web3.js";

/* Config type for the RWA Client */
export type Config = {
	connection: Connection;
	rpcUrl: string;
	confirmationOptions: ConfirmOptions;
};

export type AssetInfo = {
	mint: string;
};
