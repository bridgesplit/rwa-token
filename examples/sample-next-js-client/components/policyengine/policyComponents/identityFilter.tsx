import { useState } from "react";
import { PolicyOnChainTypes, SendToParent } from "../policyEnum";
import { IdentityFilter, Policy } from "../../../src/policy_engine/types";
import { BN } from "@coral-xyz/anchor";

type ComparisonType = {
    name: "Or" | "And";
};

type IdentityFilterDetails = {
    identityLevels: number[];
    comparisionType: ComparisonType;
};

interface IdentityFormProps {
    message: string;
    identityFilter: IdentityFilterDetails;
    onSubmit: (policy: Policy) => void;
}

function transformObject(obj: ComparisonType): Record<string, never> {
    return { [obj.name.toLowerCase()]: {} as never };
}


export const IdentityFilterForm: React.FC<IdentityFormProps> = ({ message, identityFilter, onSubmit }) => {
    const [newIdentityLevel, setNewIdentityLevel] = useState<number>(-1);
    const [identityLevels, setIdentityLevels] = useState<number[]>(identityFilter.identityLevels);
    const [comparisonType, setComparisonType] = useState<ComparisonType>(identityFilter.comparisionType);
    const [errors, setErrors] = useState<string[]>([]);

    const handleAddIdentityLevel = () => {
        const trimmedNumber = parseInt(newIdentityLevel.toString(), 10); // Convert to string and parse with radix 10
        if (!isNaN(trimmedNumber) && trimmedNumber > 0) {
            setIdentityLevels([...identityLevels, trimmedNumber]);
            setNewIdentityLevel(-1); // Reset input field
        }
    };

    const handleRemoveIdentityLevel = (index: number) => {
        const updatedLevels = [...identityLevels];
        updatedLevels.splice(index, 1);
        setIdentityLevels(updatedLevels);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const errors: string[] = [];

        if (identityLevels.length === 0) {
            errors.push("Identity levels cannot be empty.");
        }

        if (errors.length === 0) {

            console.log(transformObject(comparisonType))


            // const updatedIdentityFilter: IdentityFilter = {
            //     identityLevels: identityLevels,
            //     comparisionType: transformObject(comparisonType)
            // };

            // onSubmit(updatedIdentityFilter);
        } else {
            setErrors(errors);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{message}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="identityLevels" className="block text-gray-700">Identity Levels:</label>
                    <div className="flex">
                        <input
                            type="number"
                            id="identityLevels"
                            value={newIdentityLevel}
                            onChange={(e) => setNewIdentityLevel(parseInt(e.target.value))}
                            className="w-full px-3 py-2 mt-1 mr-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <button type="button" onClick={handleAddIdentityLevel} className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add</button>
                    </div>
                    <ul className="mt-2">
                        {identityLevels.map((level, index) => (
                            <li key={index} className="flex items-center">
                                <span>{level}</span>
                                <button type="button" onClick={() => handleRemoveIdentityLevel(index)} className="ml-2 px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                {identityFilter.comparisionType.name && (
                    <div className="mb-4">
                        <label htmlFor="comparisonType" className="block text-gray-700">Comparison Type:</label>
                        <select
                            id="comparisonType"
                            value={comparisonType.name}
                            onChange={(e) => setComparisonType({ name: e.target.value as "Or" | "And" })}
                            className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="Or">Or</option>
                            <option value="And">And</option>
                        </select>
                    </div>
                )}
                {errors.length > 0 && (
                    <div className="mb-4">
                        {errors.map((error, index) => (
                            <p key={index} className="text-red-500">{error}</p>
                        ))}
                    </div>
                )}
                <div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
                </div>
            </form>
        </div>
    );
};