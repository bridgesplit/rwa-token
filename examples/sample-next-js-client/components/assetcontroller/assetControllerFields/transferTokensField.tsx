import React, { useState } from "react"
import { IssueTokenArgs, TransferTokensArgs } from "../../../src";

interface TransferTokensFieldProps {
    message: string;
    args: TransferTokensArgs
    onSubmit: (key: string, value: string | number) => void

}

function TransferTokensField({ message, args, onSubmit }: TransferTokensFieldProps) {
    const [transferTokensArgs, setTransferTokensArgs] = useState<TransferTokensArgs>(args);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTransferTokensArgs(prev => {
            return { ...prev, [name]: value };
        });
        onSubmit(name, value)
    }
    return (
        <div>
            {Object.keys(transferTokensArgs).map((key: string) => (
                <div key={key} className="flex items-center justify-center my-4">
                    <label htmlFor={key} className="w-1/4 text-gray-700 text-xs font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type={key === 'amount' || key === "decimals" ? 'number' : 'text'} // Use 'number' type for decimals
                        id={key}
                        name={key}
                        onChange={handleInputChange}
                        className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
                    />
                </div>
            ))}
        </div>
    )
};

export default TransferTokensField;
