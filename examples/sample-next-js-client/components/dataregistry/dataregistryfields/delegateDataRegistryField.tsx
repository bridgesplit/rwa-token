import React, { useState } from "react"
import { DelegateDataRegistryArgs, SetupAssetControllerArgs } from "../../../src";

interface DelegateDataRegistryFieldProps {
    message: string;
    args: DelegateDataRegistryArgs
    onSubmit: (key: string, value: string | number) => void

}
function DelegateDataRegistryField({ message, args, onSubmit }: DelegateDataRegistryFieldProps) {
    const [setupArgs, setSetupArgs] = useState<DelegateDataRegistryArgs>(args);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSetupArgs(prev => {
            return { ...prev, [name]: value };
        });
        onSubmit(name, value)
    }

    return (
        <div>
            {Object.keys(setupArgs).map((key: string) => (
                <div key={key}>
                    <label htmlFor={key} className="block text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type={key === 'decimals' ? 'number' : 'text'}
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

export default DelegateDataRegistryField;