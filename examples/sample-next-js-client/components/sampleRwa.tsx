import axios from "axios";
import { useState } from "react";
import FullRwaAccountComponent from "./fullRwaComponent";
import { FullRwaAccount } from "./types";

interface HeliusResponse {
  id: string;
  jsonrpc: string;
  result: FullRwaAccount;
}

export const SampleHeliusRPCCalls = () => {
  const [inputValue, setInputValue] = useState("");
  const [mintResponseData, setMintResponseData] =
    useState<HeliusResponse | null>(null);
  const [authResponseData, setAuthResponseData] =
    useState<HeliusResponse | null>(null);
  const [delegateResponseData, setDelegateResponseData] =
    useState<HeliusResponse | null>(null);

  const getRwaAccountsByAuthority = async () => {
    const url = "http://localhost:9090";

    const body = {
      jsonrpc: "2.0",
      id: "0",
      method: "getRwaAccountsByAuthority",
      params: {
        id: inputValue, // Use inputValue as the mint parameter
      },
    };

    try {
      const response = await axios.post(url, body);
      setAuthResponseData(response.data); // Set response data in state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRwaAccountByMint = async () => {
    const url = "http://localhost:9090";
    const body = {
      jsonrpc: "2.0",
      id: "0",
      method: "getRwaAccountsByMint",
      params: {
        id: inputValue, // Use inputValue as the mint parameter
      },
    };

    try {
      const response = await axios.post(url, body);
      setMintResponseData(response.data); // Set response data in state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRwaAccountsByDelegate = async () => {
    const url = "http://localhost:9090";

    const body = {
      jsonrpc: "2.0",
      id: "0",
      method: "getRwaAccountsByDelegate",
      params: {
        id: inputValue, // Use inputValue as the mint parameter
      },
    };

    try {
      const response = await axios.post(url, body);
      setDelegateResponseData(response.data); // Set response data in state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleButtonClick = async (method: () => Promise<void>) => {
    await method();
  };

  return (
    <div>
      <div className="container mx-auto mt-10 text-center text-black">
        <h1>Get RWA Asset Accounts by Mint</h1>
        <p className="text-xs font-gray-400">
          For example: Ea1yrC1xRXd6tWcHL4yhGRB31j6jTwdeqd3e9LHaYUwj
        </p>
        <div className="flex justify-center items-center mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter mint ID..."
            className="p-2 mr-2"
          />
          <button
            className="px-5 border border-2 border-black bg-red-200"
            onClick={() => handleButtonClick(getRwaAccountByMint)}
          >
            Test Search By Mint
          </button>
          <button
            className="px-5 border border-2 border-black bg-red-200"
            onClick={() => handleButtonClick(getRwaAccountsByDelegate)}
          >
            Test Search by Delegate
          </button>
          <button
            className="px-5 border border-2 border-black bg-red-200"
            onClick={() => handleButtonClick(getRwaAccountsByAuthority)}
          >
            Test Search Authority
          </button>
        </div>
      </div>
      <div className="mt-4 text-left text-black">
        {mintResponseData && (
          <FullRwaAccountComponent fullRwaAccount={mintResponseData.result} />
        )}
        {delegateResponseData && (
          <FullRwaAccountComponent
            fullRwaAccount={delegateResponseData.result}
          />
        )}
        {authResponseData && (
          <FullRwaAccountComponent fullRwaAccount={authResponseData.result} />
        )}
      </div>
    </div>
  );
};

// Ea1yrC1xRXd6tWcHL4yhGRB31j6jTwdeqd3e9LHaYUwj
// const url =
//   "https://rpc.helius.xyz?api-key=5899ce49-071c-4a22-a6e0-c0e9217d5a5a";
