import { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { RwaClient } from "../src/classes"; // Import your RwaClient library
import { Wallet } from "@coral-xyz/anchor";
import { randomConnection } from "../scripts/helpers";

export const useRwaClient = () => {
  const [status, setStatus] = useState("");
  const [rwaClient, setRwaClient] = useState<RwaClient | null>(null);
  const wallet = useAnchorWallet();

  useEffect(() => {
    const setupProvider = async () => {
      try {
        const { connection, url } = randomConnection();

        const options = {
          skipPreflight: true,
          maxRetries: 3,
        };

        const config = {
          connection: connection,
          rpcUrl: url,
          confirmationOptions: options,
        };

        const client = new RwaClient(config, wallet as Wallet);
        setRwaClient(client);
        setStatus(
          "Provider setup successfully, please make sure localhost:8899 is running."
        );
      } catch (error) {
        console.error("Error:", error);
        setStatus("Error occurred during setup");
      }
    };

    if (wallet) {
      setupProvider();
    }

    // Cleanup function (optional)
    return () => {
      // Perform any cleanup if needed
    };
  }, [wallet]); // Trigger setupProvider whenever wallet changes

  return { rwaClient: rwaClient ? rwaClient : null, status };
};
