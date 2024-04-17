import LevelUser from "./identityFields/levelUser";
import SetupUser from "./identityFields/setupUser";

export const ComponentTypes = {
  SETUP_USER: "SetupUser",
  ADD_IDENTITY_LEVEL_TO_USER: "AddIdentityLevelToUser",
  REMOVE_LEVEL_FROM_USER: "RemoveLevelFromUser",
};

const SETUP_USER_ARGS = {
  payer: "",
  owner: "",
  assetMint: "",
  level: 0,
  signer: "",
};
const ADD_IDENTITY_LEVEL_TO_USER_ARGS = {
  owner: "",
  level: 0,
  assetMint: "",
  payer: "",
  signer: "",
};
const REMOVE_LEVEL_FROM_USER_ACCOUNT_ARGS = {
  owner: "",
  level: 0,
  assetMint: "",
  payer: "",
  signer: "",
};

export const IdentityTypes = {
  SETUP_USER: SETUP_USER_ARGS,
  ADD_IDENTITY_LEVEL_TO_USER: ADD_IDENTITY_LEVEL_TO_USER_ARGS,
  REMOVE_LEVEL_FROM_USER: REMOVE_LEVEL_FROM_USER_ACCOUNT_ARGS,
};

function DynamicComponent({
  type,
  handleParentState,
}: {
  type: string;
  handleParentState: (key: string, value: string | number) => void;
}) {
  let componentToRender;

  const handleSendingToParent = (key: string, value: string | number) => {
    handleParentState(key, value);
  };

  switch (type) {
    case ComponentTypes.SETUP_USER:
      componentToRender = (
        <SetupUser
          message={ComponentTypes.SETUP_USER}
          args={IdentityTypes.SETUP_USER}
          onSubmit={handleSendingToParent}
        />
      );
      break;
    case ComponentTypes.ADD_IDENTITY_LEVEL_TO_USER:
      componentToRender = (
        <LevelUser
          message={ComponentTypes.SETUP_USER}
          args={IdentityTypes.ADD_IDENTITY_LEVEL_TO_USER}
          onSubmit={handleSendingToParent}
        />
      );
      break;
    case ComponentTypes.REMOVE_LEVEL_FROM_USER:
      componentToRender = (
        <LevelUser
          message={ComponentTypes.SETUP_USER}
          args={IdentityTypes.REMOVE_LEVEL_FROM_USER}
          onSubmit={handleSendingToParent}
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
