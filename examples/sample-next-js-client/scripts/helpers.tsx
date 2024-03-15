import { BlockheightBasedTransactionConfirmationStrategy, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SendOptions, Signer, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import axios from "axios";
import bs58 from "bs58";
import { MouseEventHandler, useState } from "react";
import crypto from 'crypto';
import { ToastContent, ToastOptions, toast as showToast } from "react-toastify";
import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";

export function shortenAddress(string: string | undefined) {
    if (string === undefined) {
        return ""
    } else {
        return string.substring(0, 4) + "..." + string.substring(string.length - 4, string.length)
    }
}
export const wait = (ms: any) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const paginate = (array: any, pageSize: any, pageNumber: any) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export const createKeypair = (privateKey: string) => {
    return Keypair.fromSecretKey(bs58.decode(privateKey));
}

export const importKey = async (keyData: string, keyUsage: KeyUsage[]): Promise<CryptoKey> => {
    const parsedKey = JSON.parse(keyData);
    const key = await window.crypto.subtle.importKey(
        'jwk',
        parsedKey,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
        },
        true,
        keyUsage
    );
    return key;
};

export const encryptData = async (data: string, publicKey: CryptoKey): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP',
        },
        publicKey,
        dataBuffer
    );

    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const encryptedData = btoa(String.fromCharCode(...encryptedArray));

    return encryptedData;
};


export const importKeyBackend = async (keyData: string, keyUsage: KeyUsage[]): Promise<crypto.KeyObject> => {
    const parsedKey = JSON.parse(JSON.parse(keyData));

    const key = crypto.createPrivateKey({
        key: parsedKey,
        format: 'jwk',
        type: 'pkcs8',
    });

    return key;
};

export const walletNotConnectedPopup = () => {
    toast.info("Wallet not connected.")
}

export const errorPopup = (error?: string) => {
    toast.error(`Error!${error ? ` ${error}` : ''}`)
}

export const connections = [
    "https://mainnet.helius-rpc.com/?api-key=dedb8e41-faf1-4d98-b9b5-fb82c4b59076",
    "https://mainnet.helius-rpc.com/?api-key=0a216b11-b590-49c0-b48b-53e7d5f55c39",
    "https://mainnet.helius-rpc.com/?api-key=5899ce49-071c-4a22-a6e0-c0e9217d5a5a",
    "https://mainnet.helius-rpc.com/?api-key=a5b537c9-82f1-4224-8a8c-4e9185084352",
    "https://mainnet.helius-rpc.com/?api-key=8336ffaf-11a2-4191-a2aa-cf929c0124fa"
]

export const devnetconnections = [
    "https://devnet.helius-rpc.com/?api-key=e54baa62-eb3c-4b96-9d5f-c52ccb42c685",
    "https://devnet.helius-rpc.com/?api-key=cb256a6b-58b5-40eb-81c9-c962f30738dc"
]

export const randomConnection = () => {
    let connect = devnetconnections[Math.floor(Math.random() * devnetconnections.length)]
    return {
        connection: new Connection(connect, { commitment: "confirmed", confirmTransactionInitialTimeout: 60000 }),
        url: connect
    }
}

export const createConnection = (conn: string) => {
    return new Connection(conn, { commitment: "confirmed", confirmTransactionInitialTimeout: 60000 });
}

export const generateNewKeypair = async () => {
    const exportKey = async (key: CryptoKey): Promise<string> => {
        const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
        return JSON.stringify(exportedKey);
    };
    const generate = async (): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }> => {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: 'SHA-256' },
            },
            true,
            ['encrypt', 'decrypt']
        );

        return {
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey,
        };
    };
    // Generate the key pair
    const keyPair = await generate();

    // Export the keys as text
    const publicKeyText = await exportKey(keyPair.publicKey);
    const privateKeyText = await exportKey(keyPair.privateKey);

    console.log('Public Key:', publicKeyText);
    console.log('Private Key:', privateKeyText);
}


export const toast = {
    success: (content: ToastContent<unknown>, options?: ToastOptions<{}>) => {
        showToast.dismiss();
        showToast.success(content, options);
    },
    error: (content: ToastContent<unknown>, options?: ToastOptions<{}>) => {
        showToast.dismiss();
        showToast.error(content, options);
    },
    warning: (content: ToastContent<unknown>, options?: ToastOptions<{}>) => {
        showToast.dismiss();
        showToast.warning(content, options);
    },
    info: (content: ToastContent<unknown>, options?: ToastOptions<{}>) => {
        showToast.dismiss();
        showToast.info(content, options);
    },
    loading: (content: ToastContent<unknown>, options?: ToastOptions<{}>) => {
        showToast.dismiss();
        showToast.loading(content, options);
    },
    dismiss: () => {
        showToast.dismiss()
    }
};

export const sendV0SolanaTransaction = async (wallet: AnchorWallet, connection: Connection, instructions: TransactionInstruction[], lastAttempt?: number, signers?: Keypair[]): Promise<boolean> => {
    // starts at 0 to keep track and make sure it doesn't keep trying forever
    let attempt = (lastAttempt ?? 0) + 1
    const blockhashResponse = await connection.getLatestBlockhashAndContext('finalized');
    const lastValidHeight = blockhashResponse.value.lastValidBlockHeight;

    // creates transaction, requests wallet to sign, and sends transaction
    const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey!,
        recentBlockhash: blockhashResponse.value.blockhash,
        instructions: instructions
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    const signedTx = await wallet.signTransaction?.(transaction)
    if (signers) {
        signedTx.sign([...signers])

    }
    const signature = await connection.sendRawTransaction(signedTx?.serialize()!);

    // waits for transaction to confirm
    let confirmed = false
    confirmed = await confirmSignatureStatus(signature, connection, lastValidHeight)

    // handles dropped transactions, and will try up to 5 times
    if (attempt <= 5) {
        if (confirmed === false) {
            console.log("Transaction failed, please try again!")
            return await sendV0SolanaTransaction(wallet, connection, instructions, attempt)
        } else {
            return true
        }
    } else {
        console.log("Transaction failed after 5 tries.")
        return false
    }
}

export const confirmSignatureStatus = async (signature: string, connection: Connection, lastValidHeight: number) => {
    let hashExpired = false;
    let txSuccess = false;
    while (!hashExpired && !txSuccess) {
        const { value: status } = await connection.getSignatureStatus(signature);

        // Break loop if transaction has succeeded
        if (status?.err === null && ((status.confirmationStatus === 'confirmed') || (status.confirmationStatus === 'finalized'))) {
            txSuccess = true;
            console.log(`Transaction Success. View on explorer: https://solscan.io/tx/${signature}`);
            break;
        }
        hashExpired = await isBlockhashExpired(connection, lastValidHeight);

        // Break loop if blockhash has expired
        if (hashExpired) {
            console.log(`Blockhash has expired.`);
            return false
        }

        // Break loop if blockhash has expired
        if (status?.err !== null && status?.err !== undefined) {
            console.log(`Transaction failed. View on explorer: https://solscan.io/tx/${signature}`);
            return false
        }

        // Check again after 2.5 sec
        await wait(2500);
    }
    return txSuccess
}

export const isBlockhashExpired = async (connection: Connection, lastValidBlockHeight: number) => {
    let currentBlockHeight = (await connection.getBlockHeight('finalized'));
    return (currentBlockHeight > lastValidBlockHeight - 150); // If currentBlockHeight is greater than, blockhash has expired.
}
