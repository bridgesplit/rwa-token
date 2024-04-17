import IsuseTokensField from "./assetControllerFields/issueTokensField";
import SetupAssetControllerField from "./assetControllerFields/setupAssetController";
import TransferTokensField from "./assetControllerFields/transferTokensField";
import VoidTokensField from "./assetControllerFields/voidTokensField";

export const ComponentTypes = {
    SETUP_ASSET_CONTROLLER: 'SetupAssetController',
    ISSUE_TOKENS: 'IssueTokens',
    VOID_TOKENS: 'VoidTokens',
    TRANSFER_TOKENS: 'TransferTokens',

};


const SETUP_ASSET_CONTROLLER_ARGS = {
    authority: '',
    decimals: 2,
    payer: '',
    name: '',
    uri: '',
    symbol: ''
}
const ISSUE_TOKENS_ARGS = {
    amount: 0,
    authority: '',
    owner: '',
    assetMint: '',
    payer: ''
}
const VOID_TOKENS_ARGS = {
    amount: 0,
    owner: '',
    assetMint: '',
    payer: ''
}
const TRANSFER_TOKENS_ARGS = {
    from: '',
    to: '',
    amount: 0,
    authority: '',
    decimals: 0,
    assetMint: '',
    payer: ''
}


export const AssetTypes = {
    SETUP_ASSET_CONTROLLER: SETUP_ASSET_CONTROLLER_ARGS,
    ISSUE_TOKENS: ISSUE_TOKENS_ARGS,
    VOID_TOKENS: VOID_TOKENS_ARGS,
    TRANSFER_TOKENS: TRANSFER_TOKENS_ARGS
};



function DynamicComponent({ type, handleParentState }: { type: string, handleParentState: (key: string, value: string | number) => void }) {
    let componentToRender;

    const handleSendingToParent = (key: string, value: string | number) => {
        handleParentState(key, value)
    }

    switch (type) {
        case ComponentTypes.SETUP_ASSET_CONTROLLER:
            componentToRender = <SetupAssetControllerField message={ComponentTypes.SETUP_ASSET_CONTROLLER} args={AssetTypes.SETUP_ASSET_CONTROLLER} onSubmit={handleSendingToParent} />;
            break;
        case ComponentTypes.ISSUE_TOKENS:
            componentToRender = <IsuseTokensField message={ComponentTypes.ISSUE_TOKENS} args={AssetTypes.ISSUE_TOKENS} onSubmit={handleSendingToParent} />;
            break;
        case ComponentTypes.VOID_TOKENS:
            componentToRender = <VoidTokensField message={ComponentTypes.VOID_TOKENS} args={AssetTypes.VOID_TOKENS} onSubmit={handleSendingToParent} />;
            break;
        case ComponentTypes.TRANSFER_TOKENS:
            componentToRender = <TransferTokensField message={ComponentTypes.TRANSFER_TOKENS} args={AssetTypes.TRANSFER_TOKENS} onSubmit={handleSendingToParent} />;
            break;
        default:
            // Handle default case or throw an error for invalid type
            componentToRender = <div>Invalid Component Type</div>;
    }

    return <div>{componentToRender}</div>;
}

export default DynamicComponent;

