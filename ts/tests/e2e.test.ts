import test from 'ava';
import { setupTests } from './setup';
import { getSetupAssetRegistryIxs, getSetupIssueTokensIxs, getTransferTokensIx, getSetupUserIxs, getAttachIdentityApprovalIx } from '../src/utils';
import { Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

let mint: string;
const setup = setupTests();
const decimals = 2;
const remainingAccounts: string[] = [];

test.serial('setup registries', async (t) => {
    const createAssetRegistryArgs = {
        decimals,
        authority: setup.authority,
        delegate: null,
    };
    const setupAssetRegistry = await getSetupAssetRegistryIxs(setup.payer.toString(), setup.authority.toString(), setup.delegate.toString(), createAssetRegistryArgs)
    const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupAssetRegistry.ixs), [setup.payerKp, ...setupAssetRegistry.signers]);
    mint = setupAssetRegistry.signers[0].publicKey.toString();
    await setTimeout(() => { }, 5000);
    t.truthy(txnId);

});

test.serial('attach identity approval policy', async (t) => {
    const attachPolicy = await getAttachIdentityApprovalIx({
        payer: setup.payer.toString(),
        owner: setup.authority.toString(),
        assetMint: mint,
        authority: setup.authority.toString(),
        identityFilter: {
            identityLevels: [1],
            comparisionType: 0,
        }
    });
    const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...attachPolicy.ixs), [setup.payerKp, ...attachPolicy.signers]);
    t.truthy(txnId);
    remainingAccounts.push(attachPolicy.signers[0].publicKey.toString());
    await setTimeout(() => { }, 5000);
});

test.serial('setup user', async (t) => {
    const setupUser = await getSetupUserIxs({
        payer: setup.payer.toString(),
        owner: setup.authority.toString(),
        assetMint: mint,
        level: 1,
    });
    const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...setupUser.ixs), [setup.payerKp, ...setupUser.signers]);
    t.truthy(txnId);
    await setTimeout(() => { }, 10000);
});

test.serial('issue tokens', async (t) => {
    const issueTokens = await getSetupIssueTokensIxs({
        authority: setup.authority.toString(),
        payer: setup.payer.toString(),
        owner: setup.authority.toString(),
        assetMint: mint,
        amount: 10000
    })
    const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(...issueTokens.ixs), [setup.payerKp, ...issueTokens.signers]);
    t.truthy(txnId);
    await setTimeout(() => { }, 5000);
});

test.serial('transfer tokens', async (t) => {
    const transferTokensIx = await getTransferTokensIx({
        authority: setup.authority.toString(),
        payer: setup.payer.toString(),
        from: setup.authority.toString(),
        to: setup.authority.toString(),
        mint: mint,
        amount: 100,
        decimals,
        remainingAccounts,
    });
    const txnId = await sendAndConfirmTransaction(setup.provider.connection, new Transaction().add(transferTokensIx), [setup.payerKp]);
    t.truthy(txnId);
});