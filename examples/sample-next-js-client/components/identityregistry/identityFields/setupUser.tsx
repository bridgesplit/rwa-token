import React, { useState } from "react";
import { SetupUserArgs } from "../../../src";

interface SetUpUserProps {
  message: string;
  args: SetupUserArgs;
  onSubmit: (key: string, value: string | number) => void;
}
function SetupUser({ message, args, onSubmit }: SetUpUserProps) {
  const [setupArgs, setSetupArgs] = useState<SetupUserArgs>(args);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSetupArgs((prev) => {
      return { ...prev, [name]: value }; // Use square brackets to interpolate the name variable
    });
    onSubmit(name, value);
  };
  return (
    <div>
      {Object.keys(setupArgs).map((key: string) => (
        <div key={key} className="flex items-center justify-center my-4">
          <label
            htmlFor={key}
            className="w-1/4 text-gray-700 text-xs font-bold"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </label>
          <input
            type={key === "level" ? "number" : "text"}
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

export default SetupUser;
