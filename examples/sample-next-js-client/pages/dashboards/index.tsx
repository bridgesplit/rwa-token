import React from "react"
import { DataRegistry } from "../../components/dataregistry/dataregistry";
import { IdentityRegistry } from "../../components/identityregistry/identityRegistry";
import { AssetController } from "../../components/assetcontroller/assetController";
import { PolicyEngine } from "../../components/policyengine/policyEngineTyped";
import SetupProviderComponent from "../../components/setup";

function Dashboards() {
    return (
        <div className="flex flex-col justify-center items-center p-8">
            <SetupProviderComponent />

            <div className="block mx-auto min-[1600px]:grid grid-cols-2 gap-8">
                <AssetController />
                <PolicyEngine />
                <IdentityRegistry />
                <DataRegistry />
            </div>
        </div>
    )
};

export default Dashboards;
