import { type IdlTypes, type IdlAccounts } from "@bridgesplit/anchor";
import { type DataRegistryIdlTypes } from "../programs";

/** Represents on chain data registry account. */
export type DataRegistryAccount = IdlAccounts<DataRegistryIdlTypes>["dataRegistryAccount"];

/** Represents on chain data account pda. */
export type DataAccount = IdlAccounts<DataRegistryIdlTypes>["dataAccount"];
export type DataAccountType = IdlTypes<DataRegistryIdlTypes>["dataAccountType"];
