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
        <div className='w-[700px]'>
            <h1 className='text-black font-bold text-[24px]'>Identity Registry</h1>
            <div className="mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
                <div className='text-left bg-[#ffc900] border-4 border-black p-5 w-[250px] mx-auto '>
                    <p className='py-6 text-[10px] font-bold'>Current Identity Registry:</p>
                    <p className='py-2 text-[8px] font-bold'>{selectedAction.message}</p>
                    <JSONPretty id="json-pretty" data={identityArgs}
                        style={{ fontSize: "0.5em" }} // Set font size and color to white
                        key='color: "#f92672"'
                        mainStyle='line-height:1.3;color:#000000;overflow:auto;'
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
                <button type="submit" onClick={() => handleSubmit(identityArgs)} className="w-full py-2 px-4 bg-[#ffc900] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black">Submit Identity for Tx</button>
            </div>
        </div >
    );
};