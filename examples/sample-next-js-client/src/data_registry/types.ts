import { type IdlTypes, type IdlAccounts } from '@coral-xyz/anchor';
import { type DataRegistryIdlType } from '../programs';

/** Represents on chain data registry account. */
export type DataRegistryAccount = IdlAccounts<DataRegistryIdlType>['dataRegistryAccount'];

/** Represents on chain data account pda. */
export type DataAccount = IdlAccounts<DataRegistryIdlType>['dataAccount']
export type DataAccountType = IdlTypes<DataRegistryIdlType>['DataAccountType'];
