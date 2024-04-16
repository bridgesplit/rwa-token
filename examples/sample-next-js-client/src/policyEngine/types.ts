import { type IdlAccounts, type IdlTypes } from "@bridgesplit/anchor";
import { type PolicyEngineIdlTypes } from "../programs";

/** Represents on chain policy engine account. */
export type PolicyEngineAccount =
  IdlAccounts<PolicyEngineIdlTypes>["policyEngineAccount"];

/** Represents on chain policy account. */
export type PolicyAccount = IdlAccounts<PolicyEngineIdlTypes>["policyAccount"];

/** Represents on chain filter for identity used by the policy engine. */
export type IdentityFilter = IdlTypes<PolicyEngineIdlTypes>["identityFilter"];
export type IdentityFilterComparisonType =
  IdlTypes<PolicyEngineIdlTypes>["identityFilter"]["comparisionType"];

export type PolicyType = IdlTypes<PolicyEngineIdlTypes>["policyType"];

/** Represents on chain policy. */
export type Policy = IdlTypes<PolicyEngineIdlTypes>["policy"];
