import {Keypair} from '@solana/web3.js';
import {getProvider} from '../src/utils';
import 'dotenv/config';

export function setupTests() {
	const payerKp = new Keypair();
	const authorityKp = payerKp;
	const delegateKp = authorityKp;
	const provider = getProvider();
	const user1Kp = new Keypair();
	const user2Kp = new Keypair();
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
	};
}
