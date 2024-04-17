import { type Config } from "./types";
import { AssetController } from "./AssetController";
import { IdentityRegistry } from "./IdentityRegistry";
import { PolicyEngine } from "./PolicyEngine";
import { DataRegistry } from "./DataRegistry";
import { AnchorProvider } from "@bridgesplit/anchor";
import { Transaction, VersionedTransaction, PublicKey } from "@solana/web3.js";

/**
 * Copy of Anchor Wallet due to version typing mismatch.
 */
export interface Wallet {
  signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T
  ): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[]
  ): Promise<T[]>;
  publicKey: PublicKey;
}

/**
 * Represents a client for interacting with Real World Assets (RWA).
 */
export class RwaClient {
  /**
   * Configuration for the RWA client.
   */
  config: Config;
  provider: AnchorProvider;
  assetController: AssetController;
  dataRegistry: DataRegistry;
  identityRegistry: IdentityRegistry;
  policyEngine: PolicyEngine;

  /**
   * Constructs a new instance of the RwaClient.
   * @param rwaConfig The configuration for the RWA client.
   * @param wallet Anchor wallet used for provider
   */
  constructor(config: Config, wallet: Wallet) {
    this.config = config;
    this.provider = new AnchorProvider(
      config.connection,
      wallet,
      config.confirmationOptions
    );
    this.assetController = new AssetController(this);
    this.dataRegistry = new DataRegistry(this);
    this.identityRegistry = new IdentityRegistry(this);
    this.policyEngine = new PolicyEngine(this);
  }
}
