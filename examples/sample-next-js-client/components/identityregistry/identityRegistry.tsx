import React, { useState } from 'react';
/* SDK Imports */
import { AddLevelToIdentityAccountArgs, RemoveLevelFromIdentityAccount, RwaClient, SetupUserArgs } from '../../src';
import JSONPretty from 'react-json-pretty';
import DynamicComponent from './identityEnum';
import { useRwaClient } from '../../hooks/useRwaClient';
import { handleMessage } from './sdkfunctions';

interface Action<T> {
    message: string,
    args: T
}
export type IdentityRegistryArgs = SetupUserArgs | AddLevelToIdentityAccountArgs | RemoveLevelFromIdentityAccount

export const IdentityRegistry = () => {
    const { rwaClient } = useRwaClient();
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
            message: 'RemoveLevelFromUser',
            args: {
                owner: '',
                level: 0,
                assetMint: '',
                payer: ''
            }
        }
    ];

    const [identityArgs, setIdentityArgs] = useState<IdentityRegistryArgs>(actions[0].args)
    const [selectedAction, setSelectedAction] = useState<Action<IdentityRegistryArgs>>(actions[0]); // Default to the first action

    const handleActionSelect = (index: number) => {
        setSelectedAction(actions[index]);
        setIdentityArgs(actions[index].args)
    };

    const handleState = (key: string, value: string | number) => {
        setIdentityArgs(prev => {
            return { ...prev, [key]: value }
        })
    };

    const handleSubmit = (args: IdentityRegistryArgs) => {
        console.log(selectedAction.message, args)
        handleMessage({ message: selectedAction.message, inputValues: args }, rwaClient as RwaClient);

    };

    return (
        <div>
            <h1 className='text-black font-bold text-[24px]'>Identity Registry</h1>
            <div className="container mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
                <div className='text-left bg-blue-100 p-5 w-[30%] mx-auto '>
                    <p className='py-6 text-[10px] font-bold'>Current Identity Registry:</p>
                    <p className='py-2 text-[8px] font-bold'>{selectedAction.message}</p>
                    <JSONPretty id="json-pretty" data={identityArgs}
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
                    {selectedAction && <DynamicComponent type={selectedAction.message} handleParentState={handleState} />}
                </div>
            </div >
            <div className='py-4'>
                <button type="submit" onClick={() => handleSubmit(identityArgs)} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit Identity for Tx</button>
            </div>
        </div >
    );
};