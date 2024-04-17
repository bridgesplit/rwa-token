import React, { useState } from "react";
import { CreateDataAccountArgs, DataAccountType } from "../../../src";
import { LegalField } from "./legalField";

interface CreateDataRegistryProps {
  message: string;
  args: CreateDataAccountArgs;
  onSubmit: (key: string, value: string | number | DataAccountType) => void;
}

function CreateDataRegistry({
  message,
  args,
  onSubmit,
}: CreateDataRegistryProps) {
  const [setupDataRegistryArgs, setSetupDataRegistryArgs] =
    useState<CreateDataAccountArgs>(args);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSetupDataRegistryArgs((prev) => {
      return { ...prev, [name]: value };
    });
    onSubmit(name, value);
  };

  const handleLegalChange = (dataAccount: DataAccountType) => {
    setSetupDataRegistryArgs((prev) => {
      return { ...prev, type: dataAccount };
    });
    onSubmit("type", dataAccount);
  };
  return (
    <div>
      {Object.keys(setupDataRegistryArgs).map((key: string) => {
        if (key === "type") {
          return (
            <div key={key} className="mb-5">
              <LegalField onSubmit={handleLegalChange} />
            </div>
          );
        } else {
          return (
            <div key={key} className="flex items-center justify-center my-4">
              <label
                htmlFor={key}
                className="w-1/4 text-gray-700 text-xs font-bold"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type="text"
                id={key}
                name={key}
                onChange={handleInputChange}
                className="w-1/2 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          );
        }
      })}
    </div>
  );
}

export default CreateDataRegistry;
