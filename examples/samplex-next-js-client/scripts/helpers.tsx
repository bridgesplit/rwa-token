import { BlockheightBasedTransactionConfirmationStrategy, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SendOptions, Signer, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "../node_modules/@solana/spl-token";
import axios from "axios";
import bs58 from "bs58";
import { MouseEventHandler, useState } from "react";
import crypto from 'crypto';
import { ToastContent, ToastOptions, toast as showToast } from "react-toastify";

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
    "https://wandering-multi-hexagon.solana-mainnet.quiknode.pro/1ed143c42870d43b9b3c14edef33b5da431ea14e/",
    "https://sly-ancient-water.solana-mainnet.quiknode.pro/1f85f307b91244eabbf3e8edc31913a1e9f0ee65/",
    "https://green-polished-fire.solana-mainnet.quiknode.pro/0b8461a7cacccb991a0872d883157a01b7698b93/",
    "https://methodical-alien-diamond.solana-mainnet.quiknode.pro/915c906e06afd5bad621a099696d66253b38028a/",
    "https://hidden-purple-sponge.solana-mainnet.quiknode.pro/b2c98d2a6bcce7004f7c48e047b42f97c8e61a69/",
    "https://little-nameless-market.solana-mainnet.quiknode.pro/f32b801f07671c87541eb4867a0c4a3d2ed26bb8/",
    "https://bitter-evocative-glitter.solana-mainnet.quiknode.pro/aadeca4760637868fbcdf730332c5d848fd99b05/",
    "https://lingering-winter-vineyard.solana-mainnet.quiknode.pro/cac2c64de80fb7bd7895357dbd96a436320d0441/",
    "https://sparkling-wispy-dust.solana-mainnet.quiknode.pro/555ff48e42a059a53cc40fe214985817aa037436/",
    "https://small-delicate-ensemble.solana-mainnet.quiknode.pro/4470569f19498f848dca510b6757b179ba1cdb16/"
]

export const randomConnection = () => {
    return new Connection(connections[Math.floor(Math.random() * connections.length)], { commitment: "confirmed", confirmTransactionInitialTimeout: 60000 });
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
