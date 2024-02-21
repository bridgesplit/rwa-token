import { Keypair } from "@solana/web3.js";
import { getProvider } from "../src/utils";
import 'dotenv/config';


export function setupTests() {
    const payerKp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.PAYER_KEYPAIR ?? "")));
    const authorityKp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.AUTHORITY_KEYPAIR ?? "")));
    const delegateKp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.DELEGATE_KEYPAIR ?? "")));
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