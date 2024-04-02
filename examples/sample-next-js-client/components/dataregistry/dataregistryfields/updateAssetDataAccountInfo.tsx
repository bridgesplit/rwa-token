import React, { useState } from "react"
import { DataAccountType, UpdateDataAccountArgs } from "../../../src";
import { LegalField } from "./legalField";

interface UpdateAssetDataAccountInfoField {
    message: string;
    args: UpdateDataAccountArgs
    onSubmit: (key: string, value: string | number | DataAccountType) => void

}

function UpdateDataRegistry({ message, args, onSubmit }: UpdateAssetDataAccountInfoField) {
    const [updateDataAccountArgs, setUpdateDataAccountArgs] = useState<UpdateDataAccountArgs>(args);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateDataAccountArgs(prev => {
            return { ...prev, [name]: value };
        });
        onSubmit(name, value)
    }

    const handleLegalChange = (dataAccount: DataAccountType) => {
        setUpdateDataAccountArgs(prev => {
            return { ...prev, type: dataAccount };
        });
        onSubmit('type', dataAccount)
    }
    return (
        <div>
            {Object.keys(updateDataAccountArgs).map((key: string) => {
                if (key === "type") {
                    return (
                        <div key={key} className="mb-5">
                            <LegalField onSubmit={handleLegalChange} />
                        </div>
                    );
                } else {
                    return (
                        <div key={key}>
                            <label htmlFor={key} className="block text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                            <input
                                type="text"
                                id={key}
                                name={key}
                                onChange={handleInputChange}
                                className="w-[50%] px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    );
                }
            })}
        </div>

    )
};

export default UpdateDataRegistry;
