import React, { use, useState } from 'react';
import { Modal } from '../modal';

/* SDK Imports */
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { handleMessage } from './policySdkFunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { AttachPolicyArgs, RwaClient } from '../../src';
import { ModalTyped } from '../modalType';
import { FormInputValues } from '../types';
import { BN } from '@coral-xyz/anchor';

interface ModalContent<T> {
    message: string;
    args: T;
}

export interface ModalPropsTyped<T extends FormInputValues> {
    closeModal: () => void;
    handleSubmit: (payload: { message: string; inputValues: T }) => void;
    modalContent: ModalContent<T> | null;
}

export const PolicyEngineTyped = () => {
    const wallet = useAnchorWallet();
    const { rwaClient, status } = useRwaClient();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<any>(null);
    const [currType, setCurrType] = useState<FormInputValues>()

    // Function to handle opening modal
    const handleOpenModal = (content: { message: string, args: AttachPolicyArgs }) => {
        setModalContent(content);
        setShowModal(true);
    };

    // Function to handle closing modal
    const closeModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    // Function to handle form submission
    const handleSubmit = <T,>(ix: { message: string; inputValues: T }) => {
        // handleMessage(ix, rwaClient as RwaClient);
        console.log(ix)
        closeModal();
    };

    // Function to create arguments
    const createArgs = <T extends Record<string, any>>(obj: T) => {
        return obj
    };

    // Define actions with appropriate args
    const actions = [
        {
            message: 'IdentityApprovalPolicy',
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
        {
            message: 'TransactionCountVelocity',
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
                    transactionCountVelocity: {
                        limit: new BN(100),
                        timeframe: new BN(60),
                    },
                },
            })
        },
        {
            message: 'TransactionAmountVelocity',
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
                    transactionAmountVelocity: {
                        limit: new BN(100000),
                        timeframe: new BN(60),
                    },
                },
            })
        },
        {
            message: 'TransactionAmountLimitPolicy',
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
                    transactionAmountLimit: {
                        limit: new BN(100),
                    },
                },
            })
        },
    ];

    return (
        <div className="container mx-auto mt-10 text-center text-black border border-black">
            <h1>Policy Engine</h1>
            <p>Please note, these actions use the default policy args.</p>
            <div className="flex justify-center items-center">
                <div className="w-[80%] h-[200px] flex items-center justify-between">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            className="btn"
                            onClick={() => handleOpenModal(action as { message: string, args: AttachPolicyArgs })}
                        >
                            {action.message}
                        </button>
                    ))}
                </div>
            </div>
            {showModal && (
                <ModalTyped<AttachPolicyArgs>
                    closeModal={closeModal}
                    handleSubmit={handleSubmit}
                    modalContent={modalContent}
                />
            )}
        </div>
    );
};