import React, { useState } from "react"
import { VoidTokensArgs } from "../../../src";

interface VoidTokensFieldProps {
    message: string;
    args: VoidTokensArgs
    onSubmit: (key: string, value: string | number) => void

}
function VoidTokensField({ message, args, onSubmit }: VoidTokensFieldProps) {
    const [voidTokensArgs, setVoidTokensArgs] = useState<VoidTokensArgs>(args);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVoidTokensArgs(prev => {
            return { ...prev, [name]: value };
        });
        onSubmit(name, value)
    }
    return (
        <div>
            {Object.keys(voidTokensArgs).map((key: string) => (
                <div key={key} className="flex items-center justify-center my-4">
                    <label htmlFor={key} className="w-1/4 text-gray-700 text-xs font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type={key === 'amount' ? 'number' : 'text'} // Use 'number' type for decimals
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

export default VoidTokensField;
