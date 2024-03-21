import {AnchorProvider} from '@coral-xyz/anchor';
import {
	Connection, type Keypair, PublicKey, type TransactionInstruction,
} from '@solana/web3.js';

export const getProvider = () => {
	const connectionUrl = process.env.RPC_URL ?? 'http://localhost:8899';
	const connection = new Connection(connectionUrl);
	const anchorProvider = AnchorProvider.local();
	const provider = new AnchorProvider(connection, anchorProvider.wallet, {...AnchorProvider.defaultOptions(), commitment: 'processed'});
	return provider;
};

export type IxReturn = {
	ixs: TransactionInstruction[];
	signers: Keypair[];
};

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

export type CommonArgs = {
	assetMint: string;
	payer: string;
	signer?: string;
	amount?: number;
	owner?: string;
	authority?: string;
	delegate?: string;
};
