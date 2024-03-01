import { IdlTypes } from "@coral-xyz/anchor";
import { PolicyEngine } from "../programs";
import { IdlEnumFields } from "@coral-xyz/anchor/dist/cjs/idl";

export interface PolicyEngineAccount {
    version: number;
    assetMint: string;
    authority: string;
    delegate: string;
    maxTimeframe: number;
    policies: string[];
}

export interface PolicyAccount {
    version: number;
    policyEngine: string;
    identityFilter: IdentityFilter;
    policy: Policy;
}

export type IdentityFilter = IdlTypes<PolicyEngine>["IdentityFilter"];
export type Policy = IdlTypes<PolicyEngine>["Policy"];