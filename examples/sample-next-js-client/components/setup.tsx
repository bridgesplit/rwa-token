import React from 'react';
import { useRwaClient } from '../hooks/useRwaClient';


export const SetupProviderComponent = () => {
    const { rwaClient, status } = useRwaClient();

    return (
        <div className='mt-2 flex justify-center items-center'>
            {status &&
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="green"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-circle w-6 h-6 animate-pulse"
                >
                    <circle cx="12" cy="12" r="3" fill="none" />
                    <animate attributeName="r" from="3" to="5" dur="1s" repeatCount="indefinite" />
                </svg>
            }
            <p className='text-xs font-bold text-black'>{status ? status : 'Please connect wallet...'}</p>
        </div>
    );
};

export default SetupProviderComponent;