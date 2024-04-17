import { useState } from "react";
import {
  IdentityFilter,
  IdentityFilterComparisonType,
} from "../../../src/policy-engine/types";

interface IdentityFormProps {
  message: string;
  identityFilter: IdentityFilter;
  onSubmit: (identityFilter: IdentityFilter) => void;
}

export const IdentityFilterForm: React.FC<IdentityFormProps> = ({
  message,
  identityFilter,
  onSubmit,
}) => {
  const [newIdentityLevel, setNewIdentityLevel] = useState<number>(-1);
  const [identityLevels, setIdentityLevels] = useState<number[]>(
    identityFilter.identityLevels
  );
  const [comparisonType, setComparisonType] =
    useState<IdentityFilterComparisonType>(identityFilter.comparisionType);
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
      const updatedIdentityFilter: IdentityFilter = {
        identityLevels: identityLevels,
        comparisionType: comparisonType,
      };
      onSubmit(updatedIdentityFilter);
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{message}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex gap-2 justify-center">
            <label
              htmlFor="identityLevels"
              className="text-gray-700 text-xs font-bold"
            >
              Identity Levels:
            </label>
            <input
              type="number"
              id="identityLevels"
              value={newIdentityLevel}
              onChange={(e) => setNewIdentityLevel(parseInt(e.target.value))}
              className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
            />
            <button
              type="button"
              onClick={handleAddIdentityLevel}
              className="w-1/2 py-1 px-2 text-xs bg-[#22a094] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 block justify-center w-full">
            {identityLevels.map((level, index) => (
              <li
                key={index}
                className="flex justify-center items-center gap-4"
              >
                <span className="text-xs">{level}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIdentityLevel(index)}
                  className="w-1/3 py-1 px-2 text-xs bg-[#e24330] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        {identityFilter.comparisionType && (
          <div className="mb-4">
            <label
              htmlFor="comparisonType"
              className="w-1/4 text-gray-700 text-xs font-bold"
            >
              Comparison Type:
            </label>
            <select
              id="comparisonType"
              value={comparisonType.and ? "and" : "or"}
              onChange={(e) => {
                const newValue =
                  e.target.value === "and" ? { and: {} } : { or: {} };
                setComparisonType(newValue);
              }}
              className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="or">Or</option>
              <option value="and">And</option>
            </select>
          </div>
        )}
        {errors.length > 0 && (
          <div className="mb-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-500">
                {error}
              </p>
            ))}
          </div>
        )}
        <div>
          <button
            type="submit"
            className="py-2 px-4 bg-[#e24330] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};
