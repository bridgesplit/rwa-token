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
                <div key={key}>
                    <label htmlFor={key} className="block text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type={key === 'amount' || key === "decimals" ? 'number' : 'text'} // Use 'number' type for decimals
                        id={key}
                        name={key}
                        onChange={handleInputChange}
                        className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
            ))}
        </div>
    )
};

export default TransferTokensField;
