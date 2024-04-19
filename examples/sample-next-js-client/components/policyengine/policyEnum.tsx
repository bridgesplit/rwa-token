import { IdentityFilter, PolicyType } from "../../src";
import { IdentityApproval } from "./policyComponents/identityApproval";
import { PolicyForm } from "./policyComponents/policyForm";
// Enum defining different component types
export const ComponentTypes = {
  IDENTITY_APPROVAL: "IDENTITY_APPROVAL",
  TRANSACTION_AMOUNT_LIMIT: "TRANSACTION_AMOUNT_LIMIT",
  TRANSACTION_AMOUNT_VELOCITY: "TRANSACTION_AMOUNT_VELOCITY",
  TRANSACTION_COUNT_VELOCITY: "TRANSACTION_COUNT_VELOCITY",
  CREATE_IDENTITY_ACCOUNT: "CREATE_IDENTITY_ACCOUNT",
};

const TRANSACTION_AMOUNT_LIMIT_ARGS = {
  limit: 0,
};
const TRANSACTION_AMOUNT_VELOCITY_ARGS = {
  limit: 0,
  timeframe: 0,
};
const TRANSACTION_COUNT_VELOCITY_ARGS = {
  limit: 0,
  timeframe: 0,
};

export const PolicyTypes = {
  TRANSACTION_AMOUNT_LIMIT: TRANSACTION_AMOUNT_LIMIT_ARGS,
  TRANSACTION_AMOUNT_VELOCITY: TRANSACTION_AMOUNT_VELOCITY_ARGS,
  TRANSACTION_COUNT_VELOCITY: TRANSACTION_COUNT_VELOCITY_ARGS,
};

export const PolicyOnChainTypes = {
  TRANSACTION_AMOUNT_LIMIT: "transactionAmountLimit",
  TRANSACTION_AMOUNT_VELOCITY: "transactionAmountVelocity",
  TRANSACTION_COUNT_VELOCITY: "transactionCountVelocity",
};

export type SendToParent = (policy: PolicyType) => void;
// Component that renders different components based on enum value
function DynamicComponent({
  type,
  handlePolicySubmit,
  handleIdentitySubmit,
}: {
  type: string;
  handlePolicySubmit: (policy: PolicyType) => void;
  handleIdentitySubmit: (identityFilter: IdentityFilter) => void;
}) {
  let componentToRender;

  const sendPolicyToParent = (policy: PolicyType) => {
    handlePolicySubmit(policy);
  };

  switch (type) {
    case ComponentTypes.CREATE_IDENTITY_ACCOUNT:
      componentToRender = <IdentityApproval onSubmit={sendPolicyToParent} />;
      break;
    case ComponentTypes.IDENTITY_APPROVAL:
      componentToRender = <IdentityApproval onSubmit={sendPolicyToParent} />;
      break;
    case ComponentTypes.TRANSACTION_AMOUNT_LIMIT:
      componentToRender = (
        <PolicyForm
          message={ComponentTypes.TRANSACTION_AMOUNT_LIMIT}
          policy={PolicyTypes.TRANSACTION_AMOUNT_LIMIT}
          onSubmit={sendPolicyToParent}
        />
      );
      break;
    case ComponentTypes.TRANSACTION_AMOUNT_VELOCITY:
      componentToRender = (
        <PolicyForm
          message={ComponentTypes.TRANSACTION_AMOUNT_VELOCITY}
          policy={PolicyTypes.TRANSACTION_AMOUNT_VELOCITY}
          onSubmit={sendPolicyToParent}
        />
      );
      break;
    case ComponentTypes.TRANSACTION_COUNT_VELOCITY:
      componentToRender = (
        <PolicyForm
          message={ComponentTypes.TRANSACTION_COUNT_VELOCITY}
          policy={PolicyTypes.TRANSACTION_COUNT_VELOCITY}
          onSubmit={sendPolicyToParent}
        />
      );
      break;
    default:
      // Handle default case or throw an error for invalid type
      componentToRender = <div>Invalid Component Type</div>;
  }

  return <div>{componentToRender}</div>;
}

export default DynamicComponent;
