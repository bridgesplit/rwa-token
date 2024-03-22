import React from 'react';
import { useRwaClient } from '../hooks/useRwaClient';


export const SetupProviderComponent = () => {
    const { rwaClient, status } = useRwaClient();

    return (
        <div className='mt-2'>
            <p className='text-black'>Status: {status}</p>
        </div>
    );
};

export default SetupProviderComponent;