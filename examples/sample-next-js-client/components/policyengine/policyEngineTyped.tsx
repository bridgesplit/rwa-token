import React, { useState } from 'react';

/* SDK Imports */
import { useRwaClient } from '../../hooks/useRwaClient';
import { AttachPolicyArgs, IdentityFilter, Policy, RwaClient } from '../../src';
import DynamicComponent from './policyEnum';
import { BN } from '@coral-xyz/anchor';
import JSONPretty from 'react-json-pretty';
import { handleMessage } from './policySdkFunctions';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { IdentityFilterForm } from './policyComponents/identityFilter';

interface Action {
    message: string,
    args: AttachPolicyArgs
}

export const PolicyEngine = () => {
    // Define state to hold the selected action
    const { rwaClient, status } = useRwaClient();
    const wallet = useAnchorWallet()

    const DEFAULT_ATTACH_POLICY_ARGS: AttachPolicyArgs = {
        authority: '',
        owner: '',
        assetMint: '',
        payer: String(rwaClient?.provider.wallet.publicKey!),
        identityFilter: {
            identityLevels: [1],
            comparisionType: { or: {} },
        },
        policy: {
            identityApproval: {}
        }
    }

    const [selectedAction, setSelectedAction] = useState<Action | null>(null); // Default to the first action
    const [policyArgs, setPolicyArgs] = useState<AttachPolicyArgs>(DEFAULT_ATTACH_POLICY_ARGS); // Default to the first action

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
        setSelectedAction(actions[index]);
    };


    const handleSetPolicyInput = (policy: Policy) => {
        setPolicyArgs(prev => {
            return { ...prev, policy: policy }; // Update policy property while keeping other properties
        });
    }

    const handleIdentitySubmit = (identityFilter: IdentityFilter) => {
        setPolicyArgs(prev => {
            return { ...prev, identityFilter: identityFilter }; // Update policy property while keeping other properties
        });
    }

    const handleSubmit = async (argsWithoutPayer: AttachPolicyArgs | null) => {
        const payer = wallet?.publicKey.toString();
        if (!argsWithoutPayer || !payer) { // Check if args is null or payer is undefined
            return;
        } else {
            setPolicyArgs(prev => {
                return { ...prev, payer: payer }; // Update payer property
            });
            handleMessage(policyArgs, rwaClient as RwaClient);
        }
    };

    return (
        <div className='w-[700px]'>
            <h1 className='text-black font-bold text-[24px]'>Policy Maker</h1>
            <div className="mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
                <div className='text-left bg-[#ff7051] border-4 border-black p-5 w-[250px] mx-auto '>
                    <p className='py-6 text-[10px] font-bold underline'>Policy Engine Args</p>
                    <p className='py-2 text-[8px] font-bold'>{selectedAction?.message}</p>
                    <JSONPretty id="json-pretty" data={policyArgs}
                        style={{ fontSize: "0.5em" }} // Set font size and color to white
                        key='color:#f92672'
                        mainStyle='line-height:1.3;color:#000000;overflow:auto;'
                        valueStyle='color:#f0a267'
                    ></JSONPretty>
                </div>

                {/* TODO: Extract these into its own component */}
                <div className='border-4 border-black overflow-y-scroll h-[400px]'>
                    <div className="flex flex-row overflow-x-auto bg-black text-white p-4 sticky top-0 z-10">
                        {actions.map((action, index) => (
                            <button key={index}
                                className="p-2 text-xs rounded-full mx-2 bg-gradient-to-br from-black to-neutral-950 text-white hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900"
                                onClick={() => handleActionSelect(index)}>
                                {action.message}
                            </button>
                        ))}
                    </div>
                    <div className='block'>
                        <div className='flex items-center justify-center my-4'>
                            <label htmlFor="authority" className="w-1/4 text-gray-700 text-xs font-bold">Authority:</label>
                            <input
                                type="text"
                                id="authority"
                                value={policyArgs?.authority || ''} // Use optional chaining to avoid errors when policyArgs is null
                                onChange={(e) =>
                                    setPolicyArgs(prev => {
                                        return { ...prev, authority: e.target.value }; // Update policy property while keeping other properties
                                    })}
                                className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
                            />
                        </div>
                        <div className='flex items-center justify-center my-4'>
                            <label htmlFor="owner" className="w-1/4 text-gray-700 text-xs font-bold">Owner:</label>
                            <input
                                type="text"
                                id="owner"
                                value={policyArgs?.owner || ''} // Use optional chaining to avoid errors when policyArgs is null
                                onChange={(e) =>
                                    setPolicyArgs(prev => {
                                        return { ...prev, owner: e.target.value }; // Update policy property while keeping other properties
                                    })}
                                className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
                            />

                        </div>
                        <div className='flex items-center justify-center my-4'>
                            <label htmlFor='assetMint' className="w-1/4 text-gray-700 text-xs font-bold">Asset Mint</label>
                            <input
                                type="text"
                                id="assetMint"
                                value={policyArgs?.assetMint || ''} // Use optional chaining to avoid errors when policyArgs is null
                                onChange={(e) =>
                                    setPolicyArgs(prev => {
                                        return { ...prev, assetMint: e.target.value }; // Update policy property while keeping other properties
                                    })}
                                className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
                            />
                        </div>
                        <IdentityFilterForm message={''} identityFilter={{
                            identityLevels: [],
                            comparisionType: {
                                or: {}
                            }
                        }} onSubmit={handleIdentitySubmit} />
                        {selectedAction && <DynamicComponent type={selectedAction.message} handlePolicySubmit={handleSetPolicyInput} handleIdentitySubmit={handleIdentitySubmit} />}
                    </div>
                </div>

            </div >
            <div className='py-4'>
                <button type="submit" onClick={() => handleSubmit(policyArgs)} className="w-full py-2 px-4 bg-[#ff7051] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black">Submit Policy for Tx</button>
            </div>
        </div >
    );
};

