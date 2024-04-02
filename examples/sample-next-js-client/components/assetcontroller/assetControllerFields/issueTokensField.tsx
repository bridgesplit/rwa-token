import React, { useState } from "react"
import { IssueTokenArgs } from "../../../src";

interface IssueTokenFieldProps {
    message: string;
    args: IssueTokenArgs
    onSubmit: (key: string, value: string | number) => void

}
function IsuseTokensField({ message, args, onSubmit }: IssueTokenFieldProps) {
    const [issueTokenArgs, setIssueTokenArgs] = useState<IssueTokenArgs>(args);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIssueTokenArgs(prev => {
            return { ...prev, [name]: value };
        });
        onSubmit(name, value)
    }
    return (
        <div>
            {Object.keys(issueTokenArgs).map((key: string) => (
                <div key={key}>
                    <label htmlFor={key} className="block text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type={key === 'amount' ? 'number' : 'text'} // Use 'number' type for decimals
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

export default IsuseTokensField;
