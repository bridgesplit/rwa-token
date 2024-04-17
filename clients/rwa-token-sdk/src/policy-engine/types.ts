import { type IdlAccounts, type IdlTypes } from "@coral-xyz/anchor";
import { type PolicyEngineIdlTypes } from "../programs";

/** Represents on chain policy engine account. */
export type PolicyEngineAccount =
  IdlAccounts<PolicyEngineIdlTypes>["policyEngineAccount"];

/** Represents on chain policy account. */
export type PolicyAccount = IdlAccounts<PolicyEngineIdlTypes>["policyAccount"];

/** Represents on chain filter for identity used by the policy engine. */
export type IdentityFilter = IdlTypes<PolicyEngineIdlTypes>["identityFilter"];

/** Represents on chain identity filter's comparison type used by the policy engine. */
export type IdentityFilterComparisonType =
  IdlTypes<PolicyEngineIdlTypes>["identityFilter"]["comparisionType"];

/** Represents on chain policy. */
export type PolicyType = IdlTypes<PolicyEngineIdlTypes>["policyType"];
