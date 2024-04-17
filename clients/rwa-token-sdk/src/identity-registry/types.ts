import { type IdlAccounts } from "@bridgesplit/anchor";
import { type IdentityRegistryIdlTypes } from "../programs";

/** Represents on chain identity registry. */
export type IdentityRegistryAccount =
  IdlAccounts<IdentityRegistryIdlTypes>["identityRegistryAccount"];

/** Represents on chain identity account. */
export type IdentityAccount =
  IdlAccounts<IdentityRegistryIdlTypes>["identityAccount"];
