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
        <div>
            <h1 className='text-black font-bold text-[24px]'>Policy Maker</h1>
            <div className="container mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
                <div className='text-left bg-blue-100 p-5 w-[30%] mx-auto '>
                    <p className='py-6 text-[10px] font-bold'>Current Policy Arguments:</p>
                    <JSONPretty id="json-pretty" data={policyArgs}
                        style={{ fontSize: "0.5em" }} // Set font size and color to white
                        key='color: "#f92672"'
                        mainStyle='lineHeight: 1.3, color: "#ffffff", background: "#ffff88", overflow: "x-scroll"'
                        valueStyle='color: "#ba1bbf"'
                    ></JSONPretty>
                </div>
                {/* <p>Current Policy: {JSON.stringify(policyArgs)}</p> */}
                <div className=' border border-black overflow-y-scroll h-[400px]'>
                    <label htmlFor="authority" className="block text-gray-700 mb-1">Authority:</label>
                    <input
                        type="text"
                        id="authority"
                        value={policyArgs?.authority || ''} // Use optional chaining to avoid errors when policyArgs is null
                        onChange={(e) =>
                            setPolicyArgs(prev => {
                                return { ...prev, authority: e.target.value }; // Update policy property while keeping other properties
                            })}
                        className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <label htmlFor="assetMint" className="block text-gray-700 mb-1">Owner:</label>
                    <input
                        type="text"
                        id="owner"
                        value={policyArgs?.owner || ''} // Use optional chaining to avoid errors when policyArgs is null
                        onChange={(e) =>
                            setPolicyArgs(prev => {
                                return { ...prev, owner: e.target.value }; // Update policy property while keeping other properties
                            })}
                        className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <label htmlFor="assetMint" className="block text-gray-700 mb-1">Asset Mint:</label>
                    <input
                        type="text"
                        id="assetMint"
                        value={policyArgs?.assetMint || ''} // Use optional chaining to avoid errors when policyArgs is null
                        onChange={(e) =>
                            setPolicyArgs(prev => {
                                return { ...prev, assetMint: e.target.value }; // Update policy property while keeping other properties
                            })}
                        className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <p>Identity Filter:</p>
                    <IdentityFilterForm message={''} identityFilter={{
                        identityLevels: [],
                        comparisionType: {
                            or: {}
                        }
                    }} onSubmit={handleIdentitySubmit} />
                    <div className='w-[80%] mx-auto'>

                        <div className='block justify-between w-full'>
                            {actions.map((action, index) => (
                                <button key={index} className='bg-blue-200 p-2 rounded-full' onClick={() => handleActionSelect(index)}>
                                    {action.message}
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedAction && <DynamicComponent type={selectedAction.message} handlePolicySubmit={handleSetPolicyInput} handleIdentitySubmit={handleIdentitySubmit} />}
                </div>

            </div >
            <div className='py-4'>
                <button type="submit" onClick={() => handleSubmit(policyArgs)} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit Policy for Tx</button>
            </div>
        </div>
    );
};