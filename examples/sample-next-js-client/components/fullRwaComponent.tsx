import React from "react";
import { FullRwaAccount } from "./types";

interface FullRwaAccountComponentProps {
    fullRwaAccount: FullRwaAccount
}
const FullRwaAccountComponent = ({ fullRwaAccount }: FullRwaAccountComponentProps) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Full RWA Account Information</h2>
            {fullRwaAccount.asset_controller && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Asset Controller</h3>
                    <p><strong>Address:</strong> {fullRwaAccount.asset_controller.address}</p>
                    <p><strong>Mint:</strong> {fullRwaAccount.asset_controller.mint}</p>
                    <p><strong>Authority:</strong> {fullRwaAccount.asset_controller.authority}</p>
                    <p><strong>Delegate:</strong> {fullRwaAccount.asset_controller.delegate}</p>
                    <p><strong>Version:</strong> {fullRwaAccount.asset_controller.version}</p>
                    <p><strong>Closed:</strong> {fullRwaAccount.asset_controller.closed ? 'Yes' : 'No'}</p>
                </div>
            )}

            {fullRwaAccount.data_registry && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Data Registry</h3>
                    <p><strong>Address:</strong> {fullRwaAccount.data_registry.address}</p>
                    <p><strong>Mint:</strong> {fullRwaAccount.data_registry.mint}</p>
                    <p><strong>Version:</strong> {fullRwaAccount.data_registry.version}</p>
                    <p><strong>Closed:</strong> {fullRwaAccount.data_registry.closed ? 'Yes' : 'No'}</p>
                </div>
            )}

            {fullRwaAccount.identity_registry && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Identity Registry</h3>
                    <p><strong>Address:</strong> {fullRwaAccount.identity_registry.address}</p>
                    <p><strong>Mint:</strong> {fullRwaAccount.identity_registry.mint}</p>
                    <p><strong>Authority:</strong> {fullRwaAccount.identity_registry.authority}</p>
                    <p><strong>Delegate:</strong> {fullRwaAccount.identity_registry.delegate}</p>
                    <p><strong>Version:</strong> {fullRwaAccount.identity_registry.version}</p>
                    <p><strong>Closed:</strong> {fullRwaAccount.identity_registry.closed ? 'Yes' : 'No'}</p>
                </div>
            )}

            {fullRwaAccount.policy_engine && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Policy Engine</h3>
                    <p><strong>Address:</strong> {fullRwaAccount.policy_engine.address}</p>
                    <p><strong>Mint:</strong> {fullRwaAccount.policy_engine.mint}</p>
                    <p><strong>Authority:</strong> {fullRwaAccount.policy_engine.authority}</p>
                    <p><strong>Delegate:</strong> {fullRwaAccount.policy_engine.delegate}</p>
                    <p><strong>Policies:</strong> {fullRwaAccount.policy_engine.policies.join(', ')}</p>
                    <p><strong>Version:</strong> {fullRwaAccount.policy_engine.version}</p>
                    <p><strong>Closed:</strong> {fullRwaAccount.policy_engine.closed ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
};

export default FullRwaAccountComponent;