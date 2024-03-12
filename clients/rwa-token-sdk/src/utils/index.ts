import { AnchorProvider } from '@coral-xyz/anchor';
import {
	Connection, type Keypair, PublicKey, type TransactionInstruction,
} from '@solana/web3.js';

/** Retrieves the provider used for interacting with the Solana blockchain.
 * @returns The initialized provider for interacting with the Solana blockchain.
*/

/* Used for local testing, rwa client builds its own provider. */
export const getProvider = () => {
	const connectionUrl = process.env.RPC_URL ?? 'http://localhost:8899';
	const connection = new Connection(connectionUrl);
	const anchorProvider = AnchorProvider.local();
	const provider = new AnchorProvider(connection, anchorProvider.wallet, { ...AnchorProvider.defaultOptions(), commitment: 'processed' });
	return provider;
};

export type IxReturn = {
	ixs: TransactionInstruction[];
	signers: Keypair[];
};

/**
 * Parses remaining accounts received from a transaction instruction.
 * @param remainingAccounts - An optional array of strings representing account public keys.
 * @returns An array of parsed account objects.
 */
export function parseRemainingAccounts(remainingAccounts?: string[]) {
	if (!remainingAccounts) {
		return [];
	}

	return remainingAccounts.map(account => ({
		pubkey: new PublicKey(account),
		isWritable: false,
		isSigner: false,
	}));
}

/** Common args for all RWA instructions */
export type CommonArgs = {
	assetMint: string;
	payer: string;
	signer?: string;
	amount?: number;
	owner?: string;
	authority?: string;
	delegate?: string;
};
