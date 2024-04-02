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
        <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
            {

                <div className="mb-4">
                    <label htmlFor="comparisonType" className="block text-gray-700">Comparison Type:</label>
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
                        className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                    >
                        <option value="legal">Legal</option>
                        <option value="misc">Misc</option>
                        <option value="tax">Tax</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            }
            <div>
                <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={handleSubmit}>Confirm</button>
            </div>
        </div>
    );
};