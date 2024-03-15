import { AddLevelToIdentityAccountArgs, IssueTokenArgs, RemoveLevelFromIdentityAccount, SetupAssetControllerArgs, SetupUserArgs, TransferTokensArgs, VoidTokensArgs, } from "../src";


export type FormInputValues =
    | SetupAssetControllerArgs
    | IssueTokenArgs
    | VoidTokensArgs
    | TransferTokensArgs
    | SetupUserArgs
    | AddLevelToIdentityAccountArgs
    | RemoveLevelFromIdentityAccount

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