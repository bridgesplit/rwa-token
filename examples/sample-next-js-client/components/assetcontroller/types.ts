import { IssueTokenArgs, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs } from "@/src/asset_controller";

export type FormInputValues =
    | SetupAssetControllerArgs
    | IssueTokenArgs
    | VoidTokensArgs
    | TransferTokensArgs;

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