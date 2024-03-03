import {type IdlAccounts, type IdlTypes} from '@coral-xyz/anchor';
import {type PolicyEngine} from '../programs';

export type PolicyEngineAccount = IdlAccounts<PolicyEngine>['policyEngineAccount'];
export type PolicyAccount = IdlAccounts<PolicyEngine>['policyAccount'];

export type IdentityFilter = IdlTypes<PolicyEngine>['IdentityFilter'];
export type Policy = IdlTypes<PolicyEngine>['Policy'];
