import {type IdlAccounts} from '@coral-xyz/anchor';
import {type IdentityRegistry} from '../programs';

export type IdentityRegistryAccount = IdlAccounts<IdentityRegistry>['identityRegistryAccount'];
export type IdentityAccount = IdlAccounts<IdentityRegistry>['identityAccount'];
