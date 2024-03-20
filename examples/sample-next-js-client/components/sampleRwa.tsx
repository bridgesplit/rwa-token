import axios from 'axios';
import React, { use, useState } from 'react';

export const SampleHeliusRPCCalls = () => {

    const getRwaAccount = async () => {
        const url = "https://rpc.helius.xyz?api-key=5899ce49-071c-4a22-a6e0-c0e9217d5a5a";

        const body = {
            "jsonrpc": "2.0",
            "id": "0",
            "method": "getRwaAccountsByMint",
            "params": {
                "id": "Ea1yrC1xRXd6tWcHL4yhGRB31j6jTwdeqd3e9LHaYUwj"
            }
        };

        const getAssetsBody =
        {
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'getAssetsByOwner',
            params: {
                ownerAddress: 'dqci6TGXWGTki8DTQ1QcJ3qg4fPbxUzj6MwJBGjuhHX',
                page: 1, // Starts at 1
                limit: 1000,
                displayOptions: {
                    showFungible: true //return both fungible and non-fungible tokens
                }
            },
        }

        try {
            const response = await axios.post(url, body);
            console.log(response.data);
            if (response) {
                const getAsset = await axios.post(url, getAssetsBody)
                console.log(getAsset.data)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getRwaAccountByMint = async () => {
        const url = "https://rpc.helius.xyz?api-key=5899ce49-071c-4a22-a6e0-c0e9217d5a5a";

        const body = {
            "jsonrpc": "2.0",
            "id": "0",
            "method": "getRwaAccountsByMint",
            "params": {
                "id": "Ea1yrC1xRXd6tWcHL4yhGRB31j6jTwdeqd3e9LHaYUwj"
            }
        };

        try {
            const response = await axios.post(url, body);
            console.log(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="container mx-auto mt-10 text-center text-black border border-black">
            <h1>Sample Helius Calls</h1>
            <div className="flex justify-center items-center">
                <button className='p-4 bg-red-200' onClick={() => getRwaAccountByMint()}>Test</button>
            </div>
        </div>
    );
};