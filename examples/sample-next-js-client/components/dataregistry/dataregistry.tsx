import React, { useState } from 'react';

/* SDK Imports */
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { ModalIx, ModalProps } from '../types';
import { handleMessage } from './datasdkfunctions';
import { useRwaClient } from '../../hooks/useRwaClient';
import { AddLevelToIdentityAccountArgs, CreateDataAccountArgs, DelegateDataRegistryArgs, RemoveLevelFromIdentityAccount, RwaClient, SetupUserArgs, UpdateDataAccountArgs } from '../../src';
import JSONPretty from 'react-json-pretty';

interface Action<T> {
    message: string,
    args: T
}
export type DataRegistryArgs = CreateDataAccountArgs | UpdateDataAccountArgs | DelegateDataRegistryArgs

export const DataRegistry = () => {
    const { rwaClient } = useRwaClient();

    const actions = [
        {
            message: 'SetupDataAccount',
            args: {
                type: { legal: {} },
                name: '',
                uri: '',
                assetMint: '',
                payer: ''
            },
        },
        {
            message: 'UpdateAssetsDataAccountInfo',
            args: {
                dataAccount: '',
                name: '',
                uri: '',
                type: { title: {} },
                assetMint: '',
                payer: ''
            },
        },
        {
            message: 'DelegateDataRegistry',
            args: {
                delegate: '',
                authority: '',
                assetMint: '',
                payer: ''
            },
        }
    ];

    const [dataRegistryArgs, setDataRegistryArgs] = useState<DataRegistryArgs>(actions[0].args)
    const [selectedAction, setSelectedAction] = useState<Action<DataRegistryArgs>>(actions[0]); // Default to the first action

    const handleActionSelect = (index: number) => {
        setSelectedAction(actions[index]);
        setDataRegistryArgs(actions[index].args)
    };

    const handleState = (key: string, value: string | number) => {
        setDataRegistryArgs(prev => {
            return { ...prev, [key]: value }
        })
    };

    const handleSubmit = (args: DataRegistryArgs) => {
        console.log(selectedAction.message, args)
        handleMessage({ message: selectedAction.message, inputValues: args }, rwaClient as RwaClient);

    };

    return (
        <div>
            <h1 className='text-black font-bold text-[24px]'>Date Registry</h1>
            <div className="container mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
                <div className='text-left bg-blue-100 p-5 w-[30%] mx-auto '>
                    <p className='py-6 text-[10px] font-bold'>Current Data Registry Args:</p>
                    <p className='py-2 text-[8px] font-bold'>{selectedAction.message}</p>
                    <JSONPretty id="json-pretty" data={dataRegistryArgs}
                        style={{ fontSize: "0.5em" }} // Set font size and color to white
                        key='color: "#f92672"'
                        mainStyle='line-height:1.3;color:#000000;overflow:auto;'
                        valueStyle='color:#f0a267'
                    ></JSONPretty>
                </div>
                <div className=' border border-black overflow-y-scroll h-[400px]'>
                    <div className="flex flex-row overflow-x-auto bg-black text-white p-4">
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
                    {/* {selectedAction && <DynamicComponent type={selectedAction.message} handleParentState={handleState} />} */}
                </div>
            </div >
            <div className='py-4'>
                <button type="submit" onClick={() => handleSubmit(dataRegistryArgs)} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit Data Registry for Tx</button>
            </div>
        </div >
    );
};