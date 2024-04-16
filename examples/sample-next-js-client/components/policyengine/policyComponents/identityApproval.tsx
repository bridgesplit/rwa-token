import React from "react";
import { SendToParent } from "../policyEnum";
import { PolicyType } from "../../../src/policyEngine/types";

interface IdentityApprovalProps {
  onSubmit: SendToParent;
}

export const IdentityApproval: React.FC<IdentityApprovalProps> = ({
  onSubmit,
}) => {
  const DEFAULT_IDENTITY_POLICY: PolicyType = {
    identityApproval: {},
  };
  const handleSubmit = () => {
    onSubmit(DEFAULT_IDENTITY_POLICY);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <p className="text-lg font-bold">Attached identity approval.</p>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
};
