import React, { useState } from 'react';
import { Modal } from '../modal';

/* SDK Imports */
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { ModalIx, ModalProps } from '../types';
import { handleMessage } from './sdkfunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { AddLevelToIdentityAccountArgs, RemoveLevelFromIdentityAccount, RwaClient, SetupUserArgs } from '../../src';

export const IdentityRegistry = () => {
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
            message: 'SetupUser',
            args: createArgs<SetupUserArgs>({
                payer: '',
                owner: '',
                assetMint: '',
                level: 0
            }),

        },
        {
            message: 'AddIdentityLevelTouser',
            args: createArgs<AddLevelToIdentityAccountArgs>({
                owner: '',
                level: 0,
                assetMint: '',
                payer: ''
            }),
        },
        {
            message: 'RemoveLevelFromUserAccount',
            args: createArgs<RemoveLevelFromIdentityAccount>({
                owner: '',
                level: 0,
                assetMint: '',
                payer: ''
            }),
        }
    ];

    return (

        <div className="container mx-auto mt-10 text-center text-black border border-black">
            <h1>Identity Registry</h1>
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