import {type IdlAccounts} from '@coral-xyz/anchor';
import {type AssetController} from '../programs';

export type AssetControllerAccount = IdlAccounts<AssetController>['assetControllerAccount'];

export type TrackerAccount = IdlAccounts<AssetController>['trackerAccount'];
