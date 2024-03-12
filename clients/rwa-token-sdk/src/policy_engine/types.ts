import { type IdlAccounts, type IdlTypes } from '@coral-xyz/anchor';
import { type PolicyEngine } from '../programs';

/** Represents on chain policy engine account. */
export type PolicyEngineAccount = IdlAccounts<PolicyEngine>['policyEngineAccount'];

/** Represents on chain policy account. */
export type PolicyAccount = IdlAccounts<PolicyEngine>['policyAccount'];

/** Represents on chain filter for identity used by the policy engine. */
export type IdentityFilter = IdlTypes<PolicyEngine>['IdentityFilter'];

/** Represents on chain policy. */
export type Policy = IdlTypes<PolicyEngine>['Policy'];
