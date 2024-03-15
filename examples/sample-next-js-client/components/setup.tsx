import React, { useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { randomConnection } from '@/scripts/helpers';
import { RwaClient } from '@/src/classes/rwa';
import { Wallet } from '@coral-xyz/anchor';
import { useRwaClient } from '@/hooks/useRwaClient';


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