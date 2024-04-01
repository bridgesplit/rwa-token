import React, { useState } from "react"
import { SetupUserArgs } from "../../../src";

interface SetUpUserProps {
    message: string;
    args: SetupUserArgs
    onSubmit: (key: string, value: string | number) => void

}
function SetupUser({ message, args, onSubmit }: SetUpUserProps) {
    const [setupArgs, setSetupArgs] = useState<SetupUserArgs>(args);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSetupArgs(prev => {
            return { ...prev, [name]: value }; // Use square brackets to interpolate the name variable
        });
        onSubmit(name, value)
    }
    return (
        <div>
            <label htmlFor="payer" className="block text-gray-700 mb-1">Payer:</label>
            <input
                type="text"
                id="payer"
                name="payer"
                value={setupArgs.payer}
                onChange={(e) =>
                    handleInputChange(e)}
                className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="owner" className="block text-gray-700 mb-1">Owner:</label>
            <input
                type="text"
                id="owner"
                name="owner"
                value={setupArgs.owner}
                onChange={(e) =>
                    handleInputChange(e)}
                className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="assetMint" className="block text-gray-700 mb-1">Asset Mint:</label>
            <input
                type="text"
                id="assetMint"
                name="assetMint"
                value={setupArgs.assetMint}
                onChange={(e) =>
                    handleInputChange(e)}
                className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="level" className="block text-gray-700 mb-1">Level:</label>
            <input
                type="number"
                id="level"
                name="level"
                value={setupArgs.level}
                onChange={(e) =>
                    handleInputChange(e)}
                className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
            />
        </div>
    )
};

export default SetupUser;
