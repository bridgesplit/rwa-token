import React, { useState } from 'react';

/* SDK Imports */
import { IssueTokenArgs, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs } from '../../src/asset_controller'
import { handleMessage } from './sdkfunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { RwaClient } from '../../src';
import JSONPretty from 'react-json-pretty';

interface Action<T> {
    message: string,
    args: T
}
export type AssetControllerArgs = SetupAssetControllerArgs | IssueTokenArgs | VoidTokensArgs | TransferTokensArgs

export const IdentityRegistry = () => {
    const { rwaClient } = useRwaClient();
    const actions = [
        {
            message: 'SetupAssetController',
            args: {
                authority: '',
                decimals: 2,
                payer: '',
                delegate: '',
                name: '',
                uri: '',
                symbol: ''
            }
        },
        {
            message: 'IssueTokens',
            args: {
                amount: 0,
                authority: '',
                owner: '',
                assetMint: '',
                payer: ''
            },
        },
        {
            message: 'VoidTokens',
            args: {
                amount: 0,
                owner: '',
                assetMint: '',
                payer: ''
            },
        },
        {
            message: 'TransferToken',
            args: {
                from: '',
                to: '',
                amount: 0,
                authority: '',
                decimals: 0,
                assetMint: '',
                payer: ''
            },
        },
    ];

    const [assetControllerArgs, setAsssetControllerArgs] = useState<AssetControllerArgs>(actions[0].args)
    const [selectedAction, setSelectedAction] = useState<Action<AssetControllerArgs>>(actions[0]); // Default to the first action

    const handleActionSelect = (index: number) => {
        setSelectedAction(actions[index]);
        setAsssetControllerArgs(actions[index].args)
    };

    const handleState = (key: string, value: string | number) => {
        setAsssetControllerArgs(prev => {
            return { ...prev, [key]: value }
        })
    };

    const handleSubmit = (args: AssetControllerArgs) => {
        console.log(selectedAction.message, args)
        handleMessage({ message: selectedAction.message, inputValues: args }, rwaClient as RwaClient);

    };

    return (
        <div>
            <h1 className='text-black font-bold text-[24px]'>Asset Controller</h1>
            <div className="container mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
                <div className='text-left bg-blue-100 p-5 w-[30%] mx-auto '>
                    <p className='py-6 text-[10px] font-bold'>Current Asset Controller Args:</p>
                    <p className='py-2 text-[8px] font-bold'>{selectedAction.message}</p>
                    <JSONPretty id="json-pretty" data={assetControllerArgs}
                        style={{ fontSize: "0.5em" }} // Set font size and color to white
                        key='color: "#f92672"'
                        mainStyle='line-height:1.3;color:#000000;overflow:auto;'
                        valueStyle='color:#f0a267'
                    ></JSONPretty>
                </div>
                <div className=' border border-black overflow-y-scroll h-[400px]'>
                    <div className='block justify-between w-full'>
                        {actions.map((action, index) => (
                            <button key={index} className='bg-blue-200 p-2 rounded-full' onClick={() => handleActionSelect(index)}>
                                {action.message}
                            </button>
                        ))}
                    </div>
                    {/* {selectedAction && <DynamicComponent type={selectedAction.message} handleParentState={handleState} />} */}
                </div>
            </div >
            <div className='py-4'>
                <button type="submit" onClick={() => handleSubmit(assetControllerArgs)} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit Identity for Tx</button>
            </div>
        </div >
    );
};