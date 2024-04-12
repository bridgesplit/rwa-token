import { type IdlAccounts } from '@coral-xyz/anchor';
import { type IdentityRegistryIdlType } from '../programs';

/** Represents on chain identity registry account. */
export type IdentityRegistryAccount = IdlAccounts<IdentityRegistryIdlType>['identityRegistryAccount'];

/** Represents on chain identity account. */
export type IdentityAccount = IdlAccounts<IdentityRegistryIdlType>['identityAccount'];
