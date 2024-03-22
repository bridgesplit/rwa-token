import React from "react";
import { FullRwaAccount } from "./types";

interface FullRwaAccountComponentProps {
    fullRwaAccount: FullRwaAccount
}
const FullRwaAccountComponent = ({ fullRwaAccount }: FullRwaAccountComponentProps) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 overflow-y-scroll max-h-80">
            <h2 className="text-2xl font-semibold mb-4">Full RWA Account Information</h2>
            {fullRwaAccount.asset_controller && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-center">Asset Controller</h3>
                    <p>
                        <span className="font-bold">Address:</span>
                        <a href={`https://solana.fm/address/${fullRwaAccount.asset_controller.address}`} target="_new">
                            {fullRwaAccount.asset_controller.address}
                        </a>
                    </p>
                    <p>
                        <span className="font-bold">Mint:</span> {fullRwaAccount.asset_controller.mint}
                    </p>
                    <p>
                        <span className="font-bold">Authority:</span> {fullRwaAccount.asset_controller.authority}
                    </p>
                    <p>
                        <span className="font-bold">Delegate:</span> {fullRwaAccount.asset_controller.delegate}
                    </p>
                    <p>
                        <span className="font-bold">Version:</span> {fullRwaAccount.asset_controller.version}
                    </p>
                    <p>
                        <span className="font-bold">Closed:</span> {fullRwaAccount.asset_controller.closed ? 'Yes' : 'No'}
                    </p>
                </div>
            )}

            {fullRwaAccount.data_registry && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-center">Data Registry</h3>
                    <p>
                        <span className="font-bold">Address:</span> {fullRwaAccount.data_registry.address}
                    </p>
                    <p>
                        <span className="font-bold">Mint:</span> {fullRwaAccount.data_registry.mint}
                    </p>
                    <p>
                        <span className="font-bold">Version:</span> {fullRwaAccount.data_registry.version}
                    </p>
                    <p>
                        <span className="font-bold">Closed:</span> {fullRwaAccount.data_registry.closed ? 'Yes' : 'No'}
                    </p>
                </div>
            )}

            {fullRwaAccount.identity_registry && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-center">Identity Registry</h3>
                    <p>
                        <span className="font-bold">Address:</span> {fullRwaAccount.identity_registry.address}
                    </p>
                    <p>
                        <span className="font-bold">Mint:</span> {fullRwaAccount.identity_registry.mint}
                    </p>
                    <p>
                        <span className="font-bold">Authority:</span> {fullRwaAccount.identity_registry.authority}
                    </p>
                    <p>
                        <span className="font-bold">Delegate:</span> {fullRwaAccount.identity_registry.delegate}
                    </p>
                    <p>
                        <span className="font-bold">Version:</span> {fullRwaAccount.identity_registry.version}
                    </p>
                    <p>
                        <span className="font-bold">Closed:</span> {fullRwaAccount.identity_registry.closed ? 'Yes' : 'No'}
                    </p>
                </div>
            )}

            {fullRwaAccount.policy_engine && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-center">Policy Engine</h3>
                    <p>
                        <span className="font-bold">Address:</span> {fullRwaAccount.policy_engine.address}
                    </p>
                    <p>
                        <span className="font-bold">Mint:</span> {fullRwaAccount.policy_engine.mint}
                    </p>
                    <p>
                        <span className="font-bold">Authority:</span> {fullRwaAccount.policy_engine.authority}
                    </p>
                    <p>
                        <span className="font-bold">Delegate:</span> {fullRwaAccount.policy_engine.delegate}
                    </p>
                    <span className="font-bold">Policies:</span>
                    <ul className="list-disc pl-5">
                        {fullRwaAccount.policy_engine.policies.map((policy, index) => (
                            <li key={index}>{policy}</li>
                        ))}
                    </ul>

                    <p>
                        <span className="font-bold">Version:</span> {fullRwaAccount.policy_engine.version}
                    </p>
                    <p>
                        <span className="font-bold">Closed:</span> {fullRwaAccount.policy_engine.closed ? 'Yes' : 'No'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default FullRwaAccountComponent