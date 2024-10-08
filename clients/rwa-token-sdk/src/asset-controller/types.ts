import { type IdlAccounts } from "@coral-xyz/anchor";
import { AssetControllerIdlTypes } from "../programs";

/** Represents on chain asset controller account. */
export type AssetControllerAccount =
  IdlAccounts<AssetControllerIdlTypes>["assetControllerAccount"];
