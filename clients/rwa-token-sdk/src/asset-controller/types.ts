import { type IdlAccounts } from "@bridgesplit/anchor";
import { AssetControllerIdlTypes } from "../programs";

/** Represents on chain asset controller account. */
export type AssetControllerAccount =
  IdlAccounts<AssetControllerIdlTypes>["assetControllerAccount"];

/** Represents on chain tracker account pda. */
export type TrackerAccount = IdlAccounts<AssetControllerIdlTypes>["trackerAccount"];
