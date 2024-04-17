import { CreateDataAccountArgs, DataAccountType } from "../../src";
import CreateDataRegistry from "./dataregistryfields/createDataRegistryField";
import DelegateDataRegistryField from "./dataregistryfields/delegateDataRegistryField";
import UpdateDataRegistry from "./dataregistryfields/updateAssetDataAccountInfo";

export const ComponentTypes = {
  SETUP_DATA_ACCOUNT: "SetupDataAccount",
  UPDATE_ASSETS_DATA_ACCOUNT: "UpdateAssetsDataAccountInfo",
  DELEGATE_DATA_REGISTRY: "DelegateDataRegistry",
};

const SETUP_DATA_ACCOUNT_ARGS: CreateDataAccountArgs = {
  type: { legal: {} },
  name: "",
  uri: "",
  assetMint: "",
  payer: "",
  signer: "",
};
const UPDATE_ASSETS_DATA_ACCOUNT_ARGS = {
  dataAccount: "",
  name: "",
  uri: "",
  type: { title: {} },
  assetMint: "",
  payer: "",
  signer: "",
};
const DELEGATE_DATA_REGISTRY_ARGS = {
  delegate: "",
  authority: "",
  assetMint: "",
  payer: "",
};

export const IdentityTypes = {
  SETUP_DATA_ACCOUNT: SETUP_DATA_ACCOUNT_ARGS,
  UPDATE_ASSETS_DATA_ACCOUNT: UPDATE_ASSETS_DATA_ACCOUNT_ARGS,
  DELEGATE_DATA_REGISTRY: DELEGATE_DATA_REGISTRY_ARGS,
};

function DynamicComponent({
  type,
  handleParentState,
}: {
  type: string;
  handleParentState: (
    key: string,
    value: string | number | DataAccountType
  ) => void;
}) {
  let componentToRender;

  const handleSendingToParent = (
    key: string,
    value: string | number | DataAccountType
  ) => {
    handleParentState(key, value);
  };

  switch (type) {
    case ComponentTypes.SETUP_DATA_ACCOUNT:
      componentToRender = (
        <CreateDataRegistry
          message={ComponentTypes.SETUP_DATA_ACCOUNT}
          args={IdentityTypes.SETUP_DATA_ACCOUNT}
          onSubmit={handleSendingToParent}
        />
      );
      break;
    case ComponentTypes.UPDATE_ASSETS_DATA_ACCOUNT:
      componentToRender = (
        <UpdateDataRegistry
          message={ComponentTypes.UPDATE_ASSETS_DATA_ACCOUNT}
          args={IdentityTypes.UPDATE_ASSETS_DATA_ACCOUNT}
          onSubmit={handleSendingToParent}
        />
      );
      break;
    case ComponentTypes.DELEGATE_DATA_REGISTRY:
      componentToRender = (
        <DelegateDataRegistryField
          message={ComponentTypes.DELEGATE_DATA_REGISTRY}
          args={IdentityTypes.DELEGATE_DATA_REGISTRY}
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
