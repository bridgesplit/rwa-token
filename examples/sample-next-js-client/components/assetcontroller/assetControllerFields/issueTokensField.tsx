import React, { useState } from "react";
import { IssueTokenArgs } from "../../../src";

interface IssueTokenFieldProps {
  message: string;
  args: IssueTokenArgs;
  onSubmit: (key: string, value: string | number) => void;
}
function IsuseTokensField({ message, args, onSubmit }: IssueTokenFieldProps) {
  const [issueTokenArgs, setIssueTokenArgs] = useState<IssueTokenArgs>(args);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "amount" ? parseFloat(value) : value;
    setIssueTokenArgs((prev) => {
      return { ...prev, [name]: parsedValue };
    });
    onSubmit(name, parsedValue);
  };
  return (
    <div>
      {Object.keys(issueTokenArgs).map((key: string) => (
        <div key={key} className="flex items-center justify-center my-4">
          <label
            htmlFor={key}
            className="w-1/4 text-gray-700 text-xs font-bold"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </label>
          <input
            type={key === "amount" ? "number" : "text"} // Use 'number' type for decimals
            id={key}
            name={key}
            onChange={handleInputChange}
            className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>
      ))}
    </div>
  );
}

export default IsuseTokensField;
