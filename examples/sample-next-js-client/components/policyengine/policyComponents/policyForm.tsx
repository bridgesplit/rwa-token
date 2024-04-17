import { useState } from "react";
import { SendToParent } from "../policyEnum";
import { BN } from "@coral-xyz/anchor";
import { PolicyType } from "../../../src/policy-engine/types";

interface PolicyDetails {
  limit: number;
  timeframe?: number; // Only TRANSACTION_COUNT_VELOCITY and TRANSACTION_AMOUNT_VELOCITY have timeframe
}

interface PolicyFormProps {
  message: string;
  policy: PolicyDetails;
  onSubmit: SendToParent;
}

export const PolicyForm: React.FC<PolicyFormProps> = ({
  message,
  policy,
  onSubmit,
}) => {
  const [limit, setLimit] = useState<number>(policy.limit);
  const [timeframe, setTimeframe] = useState<number | undefined>(
    policy.timeframe
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const errors: string[] = [];

    if (isNaN(limit) || limit <= 0) {
      errors.push("Limit must be a positive number.");
    }

    if (timeframe !== undefined && (isNaN(timeframe) || timeframe <= 0)) {
      errors.push("Timeframe must be a positive number.");
    }

    if (errors.length === 0) {
      const updatedPolicy: PolicyType = (() => {
        switch (message) {
          case "TRANSACTION_AMOUNT_LIMIT":
            return {
              transactionAmountLimit: {
                limit: new BN(limit),
              },
            };
          case "TRANSACTION_AMOUNT_VELOCITY":
            return {
              transactionAmountVelocity: {
                limit: new BN(limit),
                ...(timeframe !== undefined
                  ? { timeframe: new BN(timeframe) }
                  : { timeframe: new BN(0) }),
              },
            };
          case "TRANSACTION_COUNT_VELOCITY":
            return {
              transactionCountVelocity: {
                limit: new BN(limit),
                ...(timeframe !== undefined
                  ? { timeframe: new BN(timeframe) }
                  : { timeframe: new BN(0) }),
              },
            };
          default:
            throw new Error("Unhandled policy type");
        }
      })();
      console.log("Submitting ", updatedPolicy);
      onSubmit(updatedPolicy);
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{message}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="limit" className="block text-gray-700">
            Limit:
          </label>
          <input
            type="number"
            id="limit"
            value={limit}
            min={0}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {policy.timeframe !== undefined && (
          <div className="mb-4">
            <label htmlFor="timeframe" className="block text-gray-700">
              Timeframe:
            </label>
            <input
              type="number"
              id="timeframe"
              value={timeframe || ""}
              min={0}
              onChange={(e) => setTimeframe(parseInt(e.target.value))}
              className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
            />
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
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};
