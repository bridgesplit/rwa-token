import React, { useState } from 'react';

/* SDK Imports */
import { IssueTokenArgs, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs } from '../../src/asset_controller'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { ModalIx, ModalProps } from '../types';
import { handleMessage } from './sdkfunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { RwaClient } from '../../src';

export const AssetController = () => {
    const wallet = useAnchorWallet();
    const { rwaClient, status } = useRwaClient();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<ModalProps["modalContent"]>(null);

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


    const handleSubmit = async (ix: ModalIx) => {
        handleMessage(ix, rwaClient as RwaClient)
        closeModal();
    };

    const createArgs = <T extends Record<string, any>>(obj: T) => {
        return Object.keys(obj).map(key => ({ name: key }));
    };


    const actions = [
        {
            message: 'SetupAssetController',
            args: createArgs<SetupAssetControllerArgs>({ authority: '', decimals: 2, payer: '', delegate: '', name: '', uri: '', symbol: '' }),
        },
        {
            message: 'IssueTokens',
            args: createArgs<IssueTokenArgs>({
                amount: 0,
                authority: '',
                owner: '',
                assetMint: '',
                payer: ''
            }),
        },
        {
            message: 'VoidTokens',
            args: createArgs<VoidTokensArgs>({
                amount: 0,
                owner: '',
                assetMint: '',
                payer: ''
            }),
        },
        {
            message: 'TransferToken',
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
            <h1>Asset Controller</h1>
            <div className="flex justify-center items-center">
                <div className="w-[80%] h-[200px] flex items-center justify-between">
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
            {/* {showModal && (
                <Modal
                    closeModal={closeModal}
                    handleSubmit={handleSubmit}
                    modalContent={modalContent}
                />
            )} */}
        </div>
    );
};