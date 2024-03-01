import { Keypair } from "@solana/web3.js";
import { getProvider } from "../src/utils";
import 'dotenv/config';


export function setupTests() {
    const payerKp = new Keypair();
    const authorityKp = payerKp;
    const delegateKp = authorityKp;
    const provider = getProvider();
    return {
        payerKp,
        payer: payerKp.publicKey,
        authorityKp,
        authority: authorityKp.publicKey,
        delegateKp,
        delegate: delegateKp.publicKey,
        provider,
    }
}