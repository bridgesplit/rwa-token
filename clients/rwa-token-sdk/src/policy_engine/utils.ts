import {type Idl, Program, type Provider} from '@coral-xyz/anchor';
import {PolicyEngineIdl} from '../programs/idls';
import {PublicKey} from '@solana/web3.js';
import {type PolicyEngine} from '../programs/types';

export const policyRegistryProgramId = new PublicKey('po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau');

export const getPolicyEngineProgram = (provider: Provider) => new Program(
	PolicyEngineIdl as Idl,
	policyRegistryProgramId,
	provider,
) as unknown as Program<PolicyEngine>;

export const getPolicyEnginePda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	policyRegistryProgramId,
)[0];

export const getPolicyAccountPda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[getPolicyEnginePda(assetMint).toBuffer()],
	policyRegistryProgramId,
)[0];
