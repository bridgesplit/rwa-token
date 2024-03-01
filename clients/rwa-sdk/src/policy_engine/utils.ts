import {type Idl, Program, type Provider} from '@coral-xyz/anchor';
import {PolicyEngineIdl} from '../programs/idls';
import {PublicKey} from '@solana/web3.js';
import {type PolicyEngine} from '../programs/types';

export const policyRegistryProgramId = new PublicKey('6FcM5R2KcdUGcdLunzLm3XLRFr7FiF6Hdz3EWni8YPa2');

export const getPolicyEngineProgram = (provider: Provider) => new Program(
	PolicyEngineIdl as Idl,
	policyRegistryProgramId,
	provider,
) as unknown as Program<PolicyEngine>;

export const getPolicyEnginePda = (assetMint: string) => PublicKey.findProgramAddressSync(
	[new PublicKey(assetMint).toBuffer()],
	policyRegistryProgramId,
)[0];
