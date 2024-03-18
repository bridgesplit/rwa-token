import React, { useState } from 'react';
import { Modal } from '../modal';

/* SDK Imports */
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { ModalIx, ModalProps } from '../types';
import { handleMessage } from './datasdkfunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { AddLevelToIdentityAccountArgs, CreateDataAccountArgs, DelegateDataRegistryArgs, RemoveLevelFromIdentityAccount, RwaClient, SetupUserArgs, UpdateDataAccountArgs } from '../../src';

export const DataRegistry = () => {
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
        console.log(ix)
        closeModal();
    };

    const createArgs = <T extends Record<string, any>>(obj: T) => {
        return Object.keys(obj).map(key => ({ name: key }));
    };


    const actions = [
        {
            message: 'SetupDataAccount',
            args: createArgs<CreateDataAccountArgs>({
                type: { legal: {} },
                name: '',
                uri: '',
                assetMint: '',
                payer: ''
            }),
        },
        {
            message: 'UpdateAssetsDataAccountInfo',
            args: createArgs<UpdateDataAccountArgs>({
                dataAccount: '',
                name: '',
                uri: '',
                type: { title: {} },
                assetMint: '',
                payer: ''
            }),
        },
        {
            message: 'DelegateDataRegistry',
            args: createArgs<DelegateDataRegistryArgs>({
                delegate: '',
                authority: '',
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