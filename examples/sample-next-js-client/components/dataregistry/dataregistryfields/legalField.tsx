import { useState } from "react";
import { IdentityFilter, IdentityFilterComparisonType, Policy } from "../../../src/policy_engine/types";
import { DataAccountType } from "../../../src/data_registry";

interface LegalFieldProps {
    onSubmit: (dataAccount: DataAccountType) => void;
}

export const LegalField: React.FC<LegalFieldProps> = ({ onSubmit }) => {
    const [type, setType] = useState<DataAccountType>({ legal: {} });
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (errors.length === 0) {
            console.log(type, 'types')
            onSubmit(type);
        } else {
            setErrors(errors);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 rounded-lg">
            {
                <div className="mb-4 flex items-center justify-center">
                    <label htmlFor="comparisonType" className="w-1/4 text-gray-700 text-xs font-bold">Type:</label>
                    <select
                        id="type"
                        onChange={(e) => {
                            let newValue: DataAccountType
                            switch (e.target.value) {
                                case "legal":
                                    newValue = { legal: {} };
                                    break;
                                case "tax":
                                    newValue = { tax: {} };
                                    break;
                                case "misc":
                                    newValue = { miscellaneous: {} };
                                    break;
                                case "title":
                                    newValue = { title: {} };
                                    break;
                                default:
                                    newValue = { miscellaneous: {} }; // Handle default case if necessary
                            }
                            setType(newValue);
                        }}
                        className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
                    >
                        <option value="legal">Legal</option>
                        <option value="misc">Misc</option>
                        <option value="tax">Tax</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            }
            <div>
                <button type="submit" className="w-1/2 py-1 px-2 text-xs bg-[#90a8ed] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black" onClick={handleSubmit}>Confirm</button>
            </div>
        </div>
    );
};