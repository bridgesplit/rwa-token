import {type Idl, Program, type Provider} from '@coral-xyz/anchor';
import {DataRegistryIdl} from '../programs/idls';
import {PublicKey} from '@solana/web3.js';
import {type DataRegistry} from '../programs/types';

export const dataRegistryProgramId = new PublicKey('8WRaNVNMDqdwADbKYj7fBd47i2e5SFMSEs8TrA2Vd5io');

export const getDataRegistryProgram = (provider: Provider) => new Program(
	DataRegistryIdl as Idl,
	dataRegistryProgramId,
	provider,
) as unknown as Program<DataRegistry>;

export const getDataRegistryPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	dataRegistryProgramId,
)[0];
