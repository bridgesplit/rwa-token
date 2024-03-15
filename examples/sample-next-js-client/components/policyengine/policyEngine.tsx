import React, { useState } from 'react';
import { Modal } from '../modal';

/* SDK Imports */
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { ModalIx, ModalProps } from '../types';
import { handleMessage } from './policySdkFunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { AttachPolicyArgs, RwaClient } from '../../src';

export const PolicyEngine = () => {
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
            message: 'AttachPolicy',
            args: createArgs<AttachPolicyArgs>({
                authority: '',
                owner: '',
                assetMint: '',
                payer: '',
                identityFilter: {
                    identityLevels: [1],
                    comparisionType: { or: {} },
                },
                policy: {
                    identityApproval: {},
                },
            })

        },
    ];

    return (

        <div className="container mx-auto mt-10 text-center text-black border border-black">
            <h1>Policy Engine</h1>
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