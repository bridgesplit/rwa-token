import {type IdlTypes, type IdlAccounts} from '@coral-xyz/anchor';
import {type DataRegistry} from '../programs';

/** Represents on chain data registry account. */
export type DataRegistryAccount = IdlAccounts<DataRegistry>['dataRegistryAccount'];

/** Represents on chain data account pda. */
export type DataAccount = IdlAccounts<DataRegistry>['dataAccount'];
export type DataAccountType = IdlTypes<DataRegistry>['DataAccountType'];
