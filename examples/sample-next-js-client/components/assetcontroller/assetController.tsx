import React, { useState } from 'react';

/* SDK Imports */
import { IssueTokenArgs, SetupAssetControllerArgs, TransferTokensArgs, VoidTokensArgs } from '../../src/'
import { handleMessage } from './sdkfunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { RwaClient } from '../../src';
import JSONPretty from 'react-json-pretty';
import DynamicComponent from './assetEnum';
import { PublicKey } from '@solana/web3.js';

interface Action<T> {
    message: string,
    args: T
}
export type AssetControllerArgs = SetupAssetControllerArgs | IssueTokenArgs | VoidTokensArgs | TransferTokensArgs;

export const AssetController = () => {
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
            message: 'TransferTokens',
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
        const { payer, delegate, authority } = args
        const payerOnCurve = PublicKey.isOnCurve(new PublicKey(payer))
        // const delegateOnCurve = PublicKey.isOnCurve(new PublicKey(delegate!))
        // const authOnCurve = PublicKey.isOnCurve(new PublicKey(authority!))


        handleMessage({ message: selectedAction.message, inputValues: args }, rwaClient as RwaClient);

    };

    return (
        <div className='w-[700px]'>
            <h1 className='text-black font-bold text-[24px]'>Asset Controller</h1>
            <div className="mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
                <div className='text-left bg-[#22a094] border-4 border-black p-5 w-[250px] mx-auto '>
                    <p className='py-6 text-[10px] font-bold underline'>Asset Controller Args</p>
                    <p className='py-2 text-[8px] font-bold'>{selectedAction.message}</p>
                    <JSONPretty id="json-pretty" data={assetControllerArgs}
                        style={{ fontSize: "0.5em" }} // Set font size and color to white
                        key='color: "#f92672"'
                        mainStyle='line-height:1.3;color:#000000;overflow-x:scroll;'
                        valueStyle='color:#f0a267'
                    ></JSONPretty>
                </div>
                <div className='border-4 border-black overflow-y-scroll h-[400px]'>
                    <div className="flex flex-row overflow-x-auto bg-black text-white p-4 sticky top-0 z-10">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                className="p-2 text-xs rounded-full mx-2 bg-gradient-to-br from-black to-neutral-950 text-white hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900"
                                onClick={() => handleActionSelect(index)}
                            >
                                {action.message}
                            </button>
                        ))}
                    </div>
                    {selectedAction && <DynamicComponent type={selectedAction.message} handleParentState={handleState} />}
                </div>
            </div >
            <div className='py-4'>
                <button type="submit" onClick={() => handleSubmit(assetControllerArgs)} className="w-full cursor-pointer py-2 px-4 bg-[#22a094] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black">SUBMIT INSTRUCTIONS</button>
            </div>
        </div >
    );
};