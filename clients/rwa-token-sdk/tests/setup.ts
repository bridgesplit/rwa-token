import { getProvider } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "dotenv/config";

export async function setupTests() {
	const payerKp = new Keypair();
	const authorityKp = payerKp;
	const delegateKp = authorityKp;
	const user1Kp = new Keypair();
	const user2Kp = new Keypair();
	const user3Kp = new Keypair();
	const provider = getProvider();


	// airdrop to all users
	const txns = await Promise.all([
		provider.connection.requestAirdrop(payerKp.publicKey, LAMPORTS_PER_SOL),
		provider.connection.requestAirdrop(authorityKp.publicKey, LAMPORTS_PER_SOL),
		provider.connection.requestAirdrop(delegateKp.publicKey, LAMPORTS_PER_SOL),
		provider.connection.requestAirdrop(user1Kp.publicKey, LAMPORTS_PER_SOL),
		provider.connection.requestAirdrop(user2Kp.publicKey, LAMPORTS_PER_SOL),
		provider.connection.requestAirdrop(user3Kp.publicKey, LAMPORTS_PER_SOL),
	]);

	await Promise.all(txns.map((txn) => provider.connection.confirmTransaction(txn, "finalized")));


	return {
		payerKp,
		payer: payerKp.publicKey,
		authorityKp,
		authority: authorityKp.publicKey,
		delegateKp,
		delegate: delegateKp.publicKey,
		provider,
		user1Kp,
		user1: user1Kp.publicKey,
		user2Kp,
		user2: user2Kp.publicKey,
		user3Kp,
		user3: user3Kp.publicKey,
	};
}
