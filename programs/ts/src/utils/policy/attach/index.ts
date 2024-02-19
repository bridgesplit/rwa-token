export enum ComparisionType {
    And,
    Or,
}

export interface IdentityFilter {
    identityLevels: Array<number>;
    comparisionType: number;
}

export * from "./always_approve";