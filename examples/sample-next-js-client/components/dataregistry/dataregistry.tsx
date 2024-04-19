import { useState } from "react";

/* SDK Imports */
import { handleMessage } from "./datasdkfunctions";
import { useRwaClient } from "../../hooks/useRwaClient";
import {
  CreateDataAccountArgs,
  DataAccountType,
  DelegateDataRegistryArgs,
  RwaClient,
  UpdateDataAccountArgs,
} from "../../src";
import JSONPretty from "react-json-pretty";
import DynamicComponent from "./dataRegistryEnum";
import { toast } from "../../scripts/helpers";

interface Action<T> {
  message: string;
  args: T;
}

export type DataRegistryArgs =
  | CreateDataAccountArgs
  | UpdateDataAccountArgs
  | DelegateDataRegistryArgs;

export const DataRegistry = () => {
  const { rwaClient } = useRwaClient();

  const actions: Action<DataRegistryArgs>[] = [
    {
      message: "SetupDataAccount",
      args: {
        type: { legal: {} },
        name: "",
        uri: "",
        assetMint: "",
        payer: "",
        signer: "",
      },
    },
    {
      message: "UpdateAssetsDataAccountInfo",
      args: {
        dataAccount: "",
        name: "",
        uri: "",
        type: { title: {} },
        assetMint: "",
        payer: "",
        signer: "",
      },
    },
    {
      message: "DelegateDataRegistry",
      args: {
        delegate: "",
        authority: "",
        assetMint: "",
        payer: "",
        signer: "",
      },
    },
  ];

  const [dataRegistryArgs, setDataRegistryArgs] = useState<DataRegistryArgs>(
    actions[0].args
  );
  const [selectedAction, setSelectedAction] = useState<
    Action<DataRegistryArgs>
  >(actions[0]); // Default to the first action

  const handleActionSelect = (index: number) => {
    setSelectedAction(actions[index]);
    setDataRegistryArgs(actions[index].args);
  };

  const handleState = (
    key: string,
    value: string | number | DataAccountType
  ) => {
    // Edge case to handle data account type
    if (typeof value === "object") {
      setDataRegistryArgs((prev) => {
        return { ...prev, type: value };
      });
    } else {
      setDataRegistryArgs((prev) => {
        return { ...prev, [key]: value };
      });
    }
  };

  const handleSubmit = (args: DataRegistryArgs) => {
    const hasEmptyArg = Object.values(args).some((value) => value === "");
    if (!hasEmptyArg) {
      handleMessage(
        { message: selectedAction.message, inputValues: args },
        rwaClient as RwaClient
      );
    } else {
      toast.error("Missing args, please try again.");
      console.error(
        "One or more arguments are empty. handleMessage not executed."
      );
    }
  };

  return (
    <div className="w-[700px]">
      <h1 className="text-black font-bold text-[24px]">Data Registry</h1>
      <div className="mx-auto mt-5 text-center text-black overflow-x-scroll flex gap-4">
        <div className="text-left bg-[#90a8ed] border-4 border-black p-5 w-[250px] mx-auto ">
          <p className="py-6 text-[10px] font-bold underline">
            Current Data Registry Args:
          </p>
          <p className="py-2 text-[8px] font-bold">{selectedAction.message}</p>
          <JSONPretty
            id="json-pretty"
            data={dataRegistryArgs}
            style={{ fontSize: "0.5em" }} // Set font size and color to white
            key='color: "#f92672"'
            mainStyle="line-height:1.3;color:#000000;overflow:auto;"
            valueStyle="color:#f0a267"
          ></JSONPretty>
        </div>
        <div className="border-4 border-black overflow-y-scroll h-[400px]">
          <div className="flex flex-row overflow-x-auto bg-black text-white p-4 sticky top-0 z-10">
            {actions.map((action, index) => (
              <button
                key={index}
                className="p-2 text-xs rounded-full mx-2 bg-gradient-to-br from-black to-neutral-950 text-white hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900"
                onClick={() => handleActionSelect(index)}
              >
                {action.message}
              </button>
            ))}
          </div>
          {selectedAction && (
            <DynamicComponent
              type={selectedAction.message}
              handleParentState={handleState}
            />
          )}
        </div>
      </div>
      <div className="py-4">
        <button
          type="submit"
          onClick={() => handleSubmit(dataRegistryArgs)}
          className="w-full cursor-pointer py-2 px-4 bg-[#90a8ed] text-white font-semibold rounded-md hover:bg-[#c9a272] focus:outline-none border-4 border-black"
        >
          SUBMIT INSTRUCTIONS
        </button>
      </div>
    </div>
  );
};
