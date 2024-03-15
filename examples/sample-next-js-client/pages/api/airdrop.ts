import { NextApiRequest, NextApiResponse } from 'next';
import { PublicKey } from '@solana/web3.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Parse JSON body sent by the client
        const { pubKey, connection } = req.body;

        // Ensure rwaClient is not undefined
        if (!pubKey || !connection) {
            return res.status(400).json({ error: 'rwaClient is required' });
        }

        // Perform your airdrop operation using rwaClient
        await connection.confirmTransaction(
            await connection.requestAirdrop(
                new PublicKey(pubKey),
                1000000000,
            ),
        );

        res.status(200).json({ message: 'Airdrop successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Airdrop failed' });
    }
}