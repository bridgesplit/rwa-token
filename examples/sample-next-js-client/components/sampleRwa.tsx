import axios from 'axios';
import React, { useState } from 'react';
import FullRwaAccountComponent from './fullRwaComponent';
import { FullRwaAccount } from './types';

interface HeliusResponse {
    id: string,
    jsonrpc: string,
    result: FullRwaAccount
}

export const SampleHeliusRPCCalls = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseData, setResponseData] = useState<HeliusResponse | null>(null);

    const getRwaAccountByMint = async () => {
        const url = "https://rpc.helius.xyz?api-key=5899ce49-071c-4a22-a6e0-c0e9217d5a5a";

        const body = {
            "jsonrpc": "2.0",
            "id": "0",
            "method": "getRwaAccountsByMint",
            "params": {
                "id": inputValue // Use inputValue as the mint parameter
            }
        };

        try {
            const response = await axios.post(url, body);
            setResponseData(response.data); // Set response data in state
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="container mx-auto mt-10 text-center text-black border border-black">
            <h1>Sample Helius Calls</h1>
            <div className="flex justify-center items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter mint ID..."
                    className='p-2 mr-2'
                />
                <button className='p-4 bg-red-200' onClick={getRwaAccountByMint}>Test</button>
            </div>
            {responseData && <FullRwaAccountComponent fullRwaAccount={responseData.result} />}
        </div>
    );
};


// Ea1yrC1xRXd6tWcHL4yhGRB31j6jTwdeqd3e9LHaYUwj