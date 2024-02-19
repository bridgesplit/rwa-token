import { AnchorProvider } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";

export const getProvider = () => {
    const connectionUrl = process.env.RPC_URL || "https://api.devnet.solana.com";
    const connection = new Connection(connectionUrl);
    const anchorProvider = AnchorProvider.local();
    const provider = new AnchorProvider(connection, anchorProvider.wallet, AnchorProvider.defaultOptions());
    return provider;
}

export interface ixReturn {
    ixs: Array<TransactionInstruction>,
    signers: Array<Keypair>,
}

export function parseRemainingAccounts(remainingAccounts?: string[]) {
    if (!remainingAccounts) {
        return [];
    }
    return remainingAccounts.map((account) => {
        return {
            pubkey: new PublicKey(account),
            isWritable: false,
            isSigner: false,
        };
    });

}

export * from "./asset";
export * from "./data";
export * from "./identity";
export * from "./policy";