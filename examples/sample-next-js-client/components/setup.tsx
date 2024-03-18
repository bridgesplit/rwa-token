import React from 'react';
import { useRwaClient } from '../hooks/useRwaClient';


export const SetupProviderComponent = () => {
    const { rwaClient, status } = useRwaClient();

    return (
        <div className='mt-2'>
            <p className='text-black'>Status: {status}</p>
            <button onClick={() => console.log(rwaClient)} className='bg-black text-xs rounded-full p-2'>Console Log RWA Client</button>
        </div>
    );
};

export default SetupProviderComponent;