import { PublicKey } from "@solana/web3.js";
import { type Idl, Program, type Provider, utils } from "@coral-xyz/anchor";
import { AssetControllerIdl, AssetControllerIdlTypes } from "../programs";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export const assetControllerProgramId = new PublicKey(
	"acpcFrzEYKjVLvZGWueTV8vyDjhu3oKC7sN38QELLan"
);

/**
 * Returns the asset controller program as a typed anchor program.
 * @param provider - Solana anchor provider.
 * @returns Typed solana program to be used for transaction building.
 */
export const getAssetControllerProgram = (provider: Provider) => new Program(AssetControllerIdl as Idl, provider) as unknown as Program<AssetControllerIdlTypes>;


/**
 * Retrieves the asset controller's public key for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The asset controller's pda.
 */
export const getAssetControllerPda = (assetMint: string) =>
	PublicKey.findProgramAddressSync(
		[new PublicKey(assetMint).toBuffer()],
		assetControllerProgramId
	)[0];

/**
 * Retrieves the asset controller's metadata pda account for a specific asset mint.
 * @param assetMint - The string representation of the asset's mint address.
 * @returns The asset controller's extra metadata pda.
 */
export const getExtraMetasListPda = (assetMint: string) =>
	PublicKey.findProgramAddressSync(
		[utf8.encode("extra-account-metas"), new PublicKey(assetMint).toBuffer()],
		assetControllerProgramId
	)[0];

/**
 * Retrieves the tracker pda for a specific asset controller mint and owner.
 * @param assetMint - The string representation of the asset's mint address.
 * @param owner - The string representation of asset's owner.
 * @returns The asset controller's tracker pda.
 */
export const getTrackerAccountPda = (assetMint: string, owner: string) =>
	PublicKey.findProgramAddressSync(
		[new PublicKey(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
		assetControllerProgramId
	)[0];

export const getAssetControllerEventAuthority = () => PublicKey.findProgramAddressSync(
	[utils.bytes.utf8.encode("__event_authority")],
	assetControllerProgramId
)[0];