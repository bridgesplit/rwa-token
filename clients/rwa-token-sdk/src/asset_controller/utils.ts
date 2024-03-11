import {PublicKey} from '@solana/web3.js';
import {type AssetController} from '../programs/types';
import {type Idl, Program, type Provider} from '@coral-xyz/anchor';
import {AssetControllerIdl} from '../programs/idls';
import {utf8} from '@coral-xyz/anchor/dist/cjs/utils/bytes';

export const assetControllerProgramId = new PublicKey('acpcFrzEYKjVLvZGWueTV8vyDjhu3oKC7sN38QELLan');

export const getAssetControllerProgram = (provider: Provider) => new Program(
	AssetControllerIdl as Idl,
	assetControllerProgramId,
	provider,
) as unknown as Program<AssetController>;

export const getAssetControllerPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	assetControllerProgramId,
)[0];

export const getExtraMetasListPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[utf8.encode('extra-account-metas'), new PublicKey(assetMint).toBuffer()],
	assetControllerProgramId,
)[0];

export const getTrackerAccountPda = (assetMint: string, owner: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer(), new PublicKey(owner).toBuffer()],
	assetControllerProgramId,
)[0];
