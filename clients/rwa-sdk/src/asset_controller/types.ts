import {type IdlAccounts} from '@coral-xyz/anchor';
import {type AssetController} from '../programs';

/**
 * Represents on chain asset controller account.
 */
export type AssetControllerAccount = IdlAccounts<AssetController>['assetControllerAccount'];

/**
 * Represents on chain tracker account pda.
 */
export type TrackerAccount = IdlAccounts<AssetController>['trackerAccount'];
