
import { IdentityApproval } from './policyComponents/identityApproval';
import { TransactionAmountLimit } from './policyComponents/transactionAmountLimit';
import { TransactionAmountVelocity } from './policyComponents/transactionAmountVelocity';
import { TransactionCountVelocity } from './policyComponents/transactionCountVelocity';

// Enum defining different component types
export const ComponentTypes = {
    IDENTITY_APPROVAL: 'IDENTITY_APPROVAL',
    TRANSACTION_AMOUNT_LIMIT: 'TRANSACTION_AMOUNT_LIMIT',
    TRANSACTION_AMOUNT_VELOCITY: 'TRANSACTION_AMOUNT_VELOCITY',
    TRANSACTION_COUNT_VELOCITY: 'TRANSACTION_COUNT_VELOCITY',
};

// Component that renders different components based on enum value
function DynamicComponent({ type }: { type: string }) {
    let componentToRender;

    switch (type) {
        case ComponentTypes.IDENTITY_APPROVAL:
            componentToRender = <IdentityApproval />;
            break;
        case ComponentTypes.TRANSACTION_AMOUNT_LIMIT:
            componentToRender = <TransactionAmountLimit />;
            break;
        case ComponentTypes.TRANSACTION_AMOUNT_VELOCITY:
            componentToRender = <TransactionAmountVelocity />;
            break;
        case ComponentTypes.TRANSACTION_COUNT_VELOCITY:
            componentToRender = <TransactionCountVelocity />;
            break;
        default:
            // Handle default case or throw an error for invalid type
            componentToRender = <div>Invalid Component Type</div>;
    }

    return <div>{componentToRender}</div>;
}

export default DynamicComponent;