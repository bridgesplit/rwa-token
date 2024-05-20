
import { BN, Wallet } from "@coral-xyz/anchor";
import {
	getPolicyAccountPda, getPolicyEngineProgram, getTransferTokensIx, 
	RwaClient,
} from ".././src";
import { setupTests } from "../setup";
import { ConfirmOptions, Connection, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { expect, test, describe } from "vitest";
import { Config } from "../../src/classes/types";


// setup identity approval policy and check all values match
// update identity approval policy and check all values match
// check identity approval policy logic is being enforced for users
// check identity approval policy isnt being enforced for users with skip level
// check identity approval policy can be removed and no data is being left behind