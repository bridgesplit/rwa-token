export interface PolicyEngineAccount {
    version: number;
    assetMint: string;
    authority: string;
    delegate: string;
    maxTimeframe: number;
    policies: string[];
}

export enum PolicyType {
    IdentityApproval,
    TransactionCountVelocity,
    TransactionAmountVelocity,
    TransactionAmountLimit,
}

export interface IdentityFilter {
    identityLevels: number[];
    comparisionType: number;
}

export interface IdentityApprovalAccount {
    version: number;
    identityFilter: IdentityFilter;
}

export interface TransactionAmountLimitAccount {
    version: number;
    limit: number;
    identityFilter: IdentityFilter;
}

export interface TransactionAmountVelocityAccount {
    version: number;
    limit: number;
    timeframe: number;
    identityFilter: IdentityFilter;
}

export interface TransactionCountVelocityAccount {
    version: number;
    limit: number;
    timeframe: number;
    identityFilter: IdentityFilter;
}