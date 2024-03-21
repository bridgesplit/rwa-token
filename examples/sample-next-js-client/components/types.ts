import { AddLevelToIdentityAccountArgs, AttachPolicyArgs, IssueTokenArgs, RemoveLevelFromIdentityAccount, SetupAssetControllerArgs, SetupUserArgs, TransferTokensArgs, VoidTokensArgs, } from "../src";


export type FormInputValues =
    | SetupAssetControllerArgs
    | IssueTokenArgs
    | VoidTokensArgs
    | TransferTokensArgs
    | SetupUserArgs
    | AddLevelToIdentityAccountArgs
    | AttachPolicyArgs
    | RemoveLevelFromIdentityAccount
    | Record<string, any>

export interface ModalIx {
    message: string,
    inputValues: FormInputValues
}
export interface ModalProps {
    closeModal: () => void;
    handleSubmit: ({ message, inputValues }: { message: string; inputValues: FormInputValues }) => void;
    modalContent: {
        message: string;
        args: { name: string }[];
    } | null;
}


interface ModalContent<T> {
    message: string;
    args: T;
}

export interface ModalPropsTyped<T extends FormInputValues> {
    closeModal: () => void;
    handleSubmit: (payload: { message: string; inputValues: T }) => void;
    modalContent: ModalContent<T> | null;
}
/*

Test Asset WITH DELEGATE owned by EYhnBtcxoZ4SX2u6n5Kyg1ZZvLnhhda3df11QC8X8xrk

mint:  CENmm4nmpGD3jtdr7tLxKt71vjT3Nc1JTwW1VSQFMjUR
data registry:  BpFXNiCe3K79JaJxEtYuk4BbVG119ZroyABA4TbrP5dZ
asset controller:  y761kyXh36XCF1sb3RuaXgS19GaJp9eJSxTS7PVcwT2
policy engine:  DHCZJqv5tvTG7haxmwEsJuEnThF7xMYd75wDGtnzV1ac
identity registry:  HMMGVyZzUqPxnHLCUhp7Zbqq4xoRMLWQe7Fcac71ZVGS
*/

/*
Test Asset WITHOUT DELEGATE by D1NBHwWhRMfqTh6RLo9v3mor4sPyHrkuAZTvbRS9UUGQ, has level 2 identity policy

mint:  7PjaBJ2ozdQZitcNefJXmkKUED3akfqhVLqQ3x3YQmjo
data registry:  2itNTmMoet1Uzv6tPfCPeJB1Sb4X44jyz5FdAkUnEAGX
asset controller:  7JbgcUGewsDuU5AS28PtYy5mYtuw3MhjFywRtm1Kpois
policy engine:  CgGU25AwR2eLi2zSZCcyy4d6PysWSPaa629W1kX6nrdZ
identity registry:  GZfxE9phybhF2jDA3BYDMDZAsFayhgcZFWyNaT8tY5be

*/


interface AssetControllerAccount {
    address: string;
    mint: string;
    authority: string;
    delegate: string;
    version: number;
    closed: boolean;
}

interface DataRegistryAccount {
    address: string;
    mint: string;
    version: number;
    closed: boolean;
}

interface IdentityRegistryAccount {
    address: string;
    mint: string;
    authority: string;
    delegate: string;
    version: number;
    closed: boolean;
}

interface PolicyEngine {
    address: string;
    mint: string;
    authority: string;
    delegate: string;
    policies: string[];
    version: number;
    closed: boolean;
}

export interface FullRwaAccount {
    asset_controller?: AssetControllerAccount;
    data_registry?: DataRegistryAccount;
    identity_registry?: IdentityRegistryAccount;
    policy_engine?: PolicyEngine;
}