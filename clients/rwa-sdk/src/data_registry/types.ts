import {type IdlAccounts} from '@coral-xyz/anchor';
import {type DataRegistry} from '../programs';

export type DataRegistryAccount = IdlAccounts<DataRegistry>['dataRegistryAccount'];
export type DataAccount = IdlAccounts<DataRegistry>['dataAccount'];
