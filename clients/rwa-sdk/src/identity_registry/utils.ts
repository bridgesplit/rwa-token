import {type Idl, Program, type Provider} from '@coral-xyz/anchor';
import {IdentityRegistryIdl} from '../programs/idls';
import {PublicKey} from '@solana/web3.js';
import {type IdentityRegistry} from '../programs/types';

export const identityRegistryProgramId = new PublicKey('qDnvwpjBYjH1vs1N1CSdbVkEkePp2acL7TphAYZDeoV');

export const getIdentityRegistryProgram = (provider: Provider) => new Program(
	IdentityRegistryIdl as Idl,
	identityRegistryProgramId,
	provider,
) as unknown as Program<IdentityRegistry>;

export const getIdentityRegistryPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	identityRegistryProgramId,
)[0];

export const getIdentityAccountPda = (assetMint: string, owner: string) => PublicKey.findProgramAddressSync(
	[getIdentityRegistryPda(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
	identityRegistryProgramId,
)[0];
