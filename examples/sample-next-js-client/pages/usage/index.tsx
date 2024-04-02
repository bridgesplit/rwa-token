import React from "react";

function Usage() {
    return (
        <div className="flex justify-center items-center h-screen text-xs">
            <div className="flex space-x-8">
                <div className="block w-[400px] border border-black border-4 p-10 bg-[#ffc900] shadow-xl">
                    <h1 className="text-2xl font-bold mb-4 text-black">Dashboard Usage</h1>
                    <p className="text-black mb-4">This dashboard was developed for the Bridgesplit team to test and implement RWA SDK features in a no-code environment.</p>
                    <ul className="list-disc pl-4 text-black">
                        <li className="mb-2">Step 1: Navigate through the official gitbook.</li>
                        <li className="mb-2">Step 2: Follow the step by step process to create an asset controller class.</li>
                        <li className="mb-2">Step 3: Validate on chain accounts with the BS indexer functions.</li>
                        <li className="mb-2">Step 4: Recreate on mainnet!</li>
                    </ul>
                </div>
                <div className="block w-[400px] border border-black border-4 p-10 bg-[#ff90e8] shadow-xl">
                    <h1 className="text-2xl font-bold mb-4 text-black">Dashboard Design</h1>
                    <p className="text-black mb-4">Before navigating, please note there are intentional design features.</p>
                    <ul className="list-disc pl-4 text-black">
                        <li className="mb-2">There is intentionally NO validation for args.</li>
                        <li className="mb-2">Any args take the shape of the JSON on screen.</li>
                        <li className="mb-2">Make sure wallet is connected, currently using devnet connection.</li>
                        <li className="mb-2">The RWA provider is automatically set up when you connect a wallet.</li>

                    </ul>
                </div>
            </div>
        </div>
    );
}
export default Usage;