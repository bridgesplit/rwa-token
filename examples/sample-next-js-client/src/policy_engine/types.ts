import { type IdlAccounts, type IdlTypes } from '@bridgesplit/anchor';
import { type PolicyEngineIdlType } from '../programs';

/** Represents on chain policy engine account. */
export type PolicyEngineAccount = IdlAccounts<PolicyEngineIdlType>['policyEngineAccount'];

/** Represents on chain policy account. */
export type PolicyAccount = IdlAccounts<PolicyEngineIdlType>['policyAccount'];

/** Represents on chain filter for identity used by the policy engine. */
export type IdentityFilter = IdlTypes<PolicyEngineIdlType>['IdentityFilter'];
export type IdentityFilterComparisonType = IdlTypes<PolicyEngineIdlType>['IdentityFilter']['comparisionType'];

/** Represents on chain policy. */
export type Policy = IdlTypes<PolicyEngineIdlType>['Policy'];
