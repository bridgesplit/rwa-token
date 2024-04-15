import { type IdlAccounts } from '@bridgesplit/anchor';
import { type AssetControllerIdlType } from '../programs';

/** Represents on chain asset controller account. */
export type AssetControllerAccount =
  IdlAccounts<AssetControllerIdlType>['assetControllerAccount'];

/** Represents on chain tracker account pda. */
export type TrackerAccount = IdlAccounts<AssetControllerIdlType>['trackerAccount'];
