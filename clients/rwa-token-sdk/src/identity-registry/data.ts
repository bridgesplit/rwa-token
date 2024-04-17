import { type AnchorProvider } from "@bridgesplit/anchor";
import { type IdentityRegistryAccount, type IdentityAccount } from "./types";
import {
  getIdentityAccountPda,
  getIdentityRegistryPda,
  getIdentityRegistryProgram,
} from "./utils";

/**
 * Retrieves identity registry account associated with a specific asset mint.
 * @param assetMint - The string representation of the asset mint.
 * @returns A promise resolving to {@link IdentityRegistryAccount}, or `undefined` if it doesn't exist.
 */
export async function getIdentityRegistryAccount(
  assetMint: string,
  provider: AnchorProvider
): Promise<IdentityRegistryAccount | undefined> {
  const identityRegistryProgram = getIdentityRegistryProgram(provider);
  const identityRegistryPda = getIdentityRegistryPda(assetMint);
  return identityRegistryProgram.account.identityRegistryAccount
    .fetch(identityRegistryPda)
    .then((account) => account)
    .catch(() => undefined);
}

/**
 * Retrieves all identity accounts associated with a specific asset mint and owner.
 * @param assetMint - The string representation of the asset mint.
 * @param owner - The string representation of the asset owner.
 * @returns A promise resolving to the {@link IdentityAccount}, or `undefined` if it doesn't exist.
 */
export async function getIdentityAccount(
  assetMint: string,
  owner: string,
  provider: AnchorProvider
): Promise<IdentityAccount | undefined> {
  const identityRegistryProgram = getIdentityRegistryProgram(provider);
  const identityAccountPda = getIdentityAccountPda(assetMint, owner);
  return identityRegistryProgram.account.identityAccount
    .fetch(identityAccountPda)
    .then((account) => account)
    .catch(() => undefined);
}
