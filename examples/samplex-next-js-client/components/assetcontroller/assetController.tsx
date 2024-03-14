import React, { useState } from 'react';
import { Modal } from './modal';

/* SDK Imports */
import { IssueTokenArgs, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs } from '../../src/asset_controller'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRwaClient } from '@/hooks/useRwaClient';
import { Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

interface ModalProps {
    closeModal: () => void;
    handleSubmit: (inputValues: Record<string, string>) => void;
    modalContent: {
        message: string;
        args: { name: string }[];
    } | null;
}
export const AssetController = () => {
    // const wallet = useAnchorWallet();
    // const { rwaClient, status } = useRwaClient();
    // if (!rwaClient || !wallet) {
    //     return null;
    // }
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<ModalProps["modalContent"]>(null);
    // let rwaClient: rwaClient = new RwaClient()

    // Function to handle opening modal
    const handleOpenModal = (content: ModalProps["modalContent"]) => {
        setModalContent(content);
        setShowModal(true);
    };

    // Function to handle closing modal
    const closeModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    // Function to handle form submission
    const handleSubmit = async (inputValues: any) => {
        console.log('Submitting with input:', inputValues);
        closeModal();
    };

    const createArgs = <T extends Record<string, any>>(obj: T) => {
        return Object.keys(obj).map(key => ({ name: key }));
    };

    const actions = [
        {
            message: 'Setting up registry',
            args: createArgs<SetupAssetControllerArgs>({ authority: '', decimals: 2, payer: '', delegate: '', name: '', uri: '', symbol: '' }),
        },
        {
            message: 'Issue Tokens',
            args: createArgs<IssueTokenArgs>({
                amount: 0,
                authority: '',
                owner: '',
                assetMint: '',
                payer: ''
            }),
        },
        {
            message: 'Void Tokens',
            args: createArgs<VoidTokensArgs>({
                amount: 0,
                owner: '',
                assetMint: '',
                payer: ''
            }),
        },
        {
            message: 'Transfer Token',
            args: createArgs<TransferTokensArgs>({
                from: '',
                to: '',
                amount: 0,
                authority: '',
                decimals: 0,
                assetMint: '',
                payer: ''
            }),
        },
    ];

    return (

        <div className="container mx-auto mt-10 text-center text-black border border-black">
            <div className="flex justify-center items-center">
                <div className="w-[80%] h-[200px] flex items-center justify-between bg-red-100">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            className="btn"
                            onClick={() => handleOpenModal(action)}
                        >
                            {action.message}
                        </button>
                    ))}
                </div>
            </div>
            {showModal && (
                <Modal
                    closeModal={closeModal}
                    handleSubmit={handleSubmit}
                    modalContent={modalContent}
                />
            )}
        </div>
    );
};