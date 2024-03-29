import React, { useState } from 'react';
/* SDK Imports */
import { AddLevelToIdentityAccountArgs, SetupUserArgs } from '../../src';



interface Action<T> {
    message: string;
    args: T
}

type IdentityRegistryArgs = SetupUserArgs | AddLevelToIdentityAccountArgs | any

export const IdentityRegistry = () => {
    const [currentModal, setCurrentModal] = useState<string | null>(null);

    const handleOpenModal = (message: string) => {
        setCurrentModal(message);
    };

    const handleCloseModal = () => {
        setCurrentModal(null);
    };

    const actions: Action<IdentityRegistryArgs>[] = [
        {
            message: 'SetupUser',
            args: {
                payer: '',
                owner: '',
                assetMint: '',
                level: 0
            }
        },
        {
            message: 'AddIdentityLevelToUser',
            args: {
                owner: '',
                level: 0,
                assetMint: '',
                payer: ''
            }
        },
        {
            message: 'RemoveLevelFromUserAccount',
            args: {
                owner: '',
                level: 0,
                assetMint: '',
                payer: ''
            }
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
                            onClick={() => handleOpenModal(action.message)}
                        >
                            {action.message}
                        </button>
                    ))}
                </div>
            </div>
            {/* {currentModal === 'SetupUser' && (
                <ModalGeneric closeModal={handleCloseModal} handleSubmit={() => console.log('submit')} modalContent={actions[0]} />
            )}
            {currentModal === 'AddIdentityLevelToUser' && (
                <ModalGeneric closeModal={handleCloseModal} handleSubmit={() => console.log('submit')} modalContent={actions[1]} />
            )}
            {currentModal === 'RemoveLevelFromUserAccount' && (
                <ModalGeneric closeModal={handleCloseModal} handleSubmit={() => console.log('submit')} modalContent={actions[2]} />
            )} */}
        </div>
    );
};