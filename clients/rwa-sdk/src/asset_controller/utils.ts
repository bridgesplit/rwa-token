import { PublicKey } from "@solana/web3.js";
import { AssetController } from "../programs/types";
import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { AssetControllerIdl } from "../programs/idls";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export const ASSET_CONTROLLER_PROGRAM_ID = new PublicKey("DtrBDukceZpUnWmeNzqtoBQPdXW8p9xmWYG1z7qMt8qG");

export const getAssetControllerProgram = (provider: Provider) => {
    return new Program(
        AssetControllerIdl as Idl,
        ASSET_CONTROLLER_PROGRAM_ID,
        provider
    ) as unknown as Program<AssetController>;
}

export const getAssetControllerPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(assetMint).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}

export const getExtraMetasListPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [utf8.encode("extra-account-metas"), new PublicKey(assetMint).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}

export const getTransactionApprovalAccountPda = (assetMint: string) => {
    return PublicKey.findProgramAddressSync(
        [utf8.encode("transaction-approval-account"), new PublicKey(assetMint).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}

export const getTrackerAccountPda = (assetMint: string, owner: string) => {
    return PublicKey.findProgramAddressSync(
        [new PublicKey(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
        ASSET_CONTROLLER_PROGRAM_ID
    )[0];
}