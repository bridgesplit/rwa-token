import React, { FC, useMemo } from "react"
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import {
    WalletModalProvider,
} from "@solana/wallet-adapter-react-ui"
import { connections, randomConnection } from "../../scripts/helpers"

const Wallet = ({ children }: { children: any }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = (process.env.NEXT_PUBLIC_DEVNET === "false" ? "mainnet-beta" : "devnet") as WalletAdapterNetwork

    const endpoint = process.env.NEXT_PUBLIC_DEVNET === "false" ? connections[Math.floor(Math.random() * connections.length)] : "https://api.devnet.solana.com"

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter()
        ],
        [network]
    )

    return (
        <ConnectionProvider
            endpoint={endpoint}
            config={{
                commitment: "processed",
            }}
        >
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default Wallet