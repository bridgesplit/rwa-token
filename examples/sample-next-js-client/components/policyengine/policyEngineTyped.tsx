import React, { useState } from 'react';

/* SDK Imports */
import { useRwaClient } from '../../hooks/useRwaClient';
import { AttachPolicyArgs, Policy, RwaClient } from '../../src';
import { FormInputValues } from '../types';
import { BN } from '@coral-xyz/anchor';
import DynamicComponent, { ComponentTypes } from './policyEnum';
import { handleMessage } from './policySdkFunctions';

interface Action {
    message: string,
    args: AttachPolicyArgs
}

export const PolicyEngine = () => {
    // Define state to hold the selected action
    const [selectedAction, setSelectedAction] = useState<Action | null>(null); // Default to the first action
    const [policyInput, setPolicyInput] = useState<Policy | null>(null); // Default to the first action

    const actions: Action[] = [
        {
            message: 'IDENTITY_APPROVAL',
            args: {
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
            }
        },
        {
            message: 'TRANSACTION_COUNT_VELOCITY',
            args: {
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
            }
        },
        {
            message: 'TRANSACTION_AMOUNT_VELOCITY',
            args: {
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
            }
        },
        {
            message: 'TRANSACTION_AMOUNT_LIMIT',
            args: {
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
            }
        },
    ];

    const handleActionSelect = (index: number) => {
        console.log('clicked, ', actions[index].message)
        setSelectedAction(actions[index]);
    };

    const handleSetPolicyInput = (policy: Policy) => {
        setPolicyInput((prev) => policy)
    }

    // const handleSubmit = async (args: AttachPolicyArgs) => {
    //     handleMessage(args, rwaClient as RwaClient)
    // };

    return (
        <div className="container mx-auto mt-10 text-center text-black border border-black overflow-x-scroll">
            <h1>Policy Engine</h1>
            <p>Please note, these actions use the default policy args.</p>
            <div className='w-[80%] mx-auto'>
                <div className='flex justify-between w-full '>
                    {actions.map((action, index) => (
                        <button key={index} className='bg-blue-200 p-2 rounded-full' onClick={() => handleActionSelect(index)}>
                            {action.message}
                        </button>
                    ))}
                </div>
            </div>
            {/* Render the selected action */}
            {selectedAction && <DynamicComponent type={selectedAction.message} handleSubmit={handleSetPolicyInput} />}
        </div>
    );
};