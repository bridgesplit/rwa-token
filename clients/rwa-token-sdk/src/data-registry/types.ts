import { type IdlTypes, type IdlAccounts } from "@coral-xyz/anchor";
import { type DataRegistryIdlTypes } from "../programs";

/** Represents on chain data registry account. */
export type DataRegistryAccount =
  IdlAccounts<DataRegistryIdlTypes>["dataRegistryAccount"];

/** Represents on chain data account pda. */
export type DataAccount = IdlAccounts<DataRegistryIdlTypes>["dataAccount"];

/** Represents on chain data account type/document. */
export type DataAccountType = IdlTypes<DataRegistryIdlTypes>["dataAccountType"];
