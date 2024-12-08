import {
  Account,
  Aptos,
  AptosConfig,
  Network,
  TransactionWorkerEventsEnum,
  InputGenerateTransactionPayloadData,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";
import { config } from "dotenv";
config();

const APTOS_NETWORK: Network = Network.TESTNET;
const TRANSACTION_COUNT = 120; // Reduced total number of transactions
const FAILING_TRANSACTION_COUNT = 1; // Number of failing transactions
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const privateKey = new Ed25519PrivateKey(PRIVATE_KEY);

async function main() {
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const aptos = new Aptos(config);

  console.log("Starting TransactionWorker test with mixed transactions...");
  const account = Account.fromPrivateKey({ privateKey });
  console.log(`Using account: ${account.accountAddress.toString()}`);

  // Create transaction payloads
  const payloads = createMixedTransactionPayloads(account, TRANSACTION_COUNT, FAILING_TRANSACTION_COUNT);

  setupEventListeners(aptos);

  // Submit transactions
  console.log(`Submitting ${payloads.length} transactions (${FAILING_TRANSACTION_COUNT} expected to fail)...`);
  const start = Date.now();
  await submitTransactions(aptos, account, payloads);

  // Wait for all transactions to be processed
  await waitForTransactionsToComplete(aptos);

  const end = Date.now();
  console.log(`All transactions processed in ${(end - start) / 1000} seconds`);

  // Verify final account state
  await verifyFinalAccountState(aptos, account);

  console.log("TransactionWorker test completed.");
}

function createMixedTransactionPayloads(
  account: Account,
  transactionCount: number,
  failingCount: number
): InputGenerateTransactionPayloadData[] {
  const payloads: InputGenerateTransactionPayloadData[] = [];
  
  // Add failing transactions (attempting to transfer 1000 APT)
  for (let i = 0; i < failingCount; i++) {
    payloads.push({
      function: "0x1::aptos_account::transfer",
      functionArguments: [account.accountAddress, "100000000000"], // 1000 APT in octas
    });
  }

  // Add passing transactions (transferring 1 octa)
  for (let i = failingCount; i < transactionCount; i++) {
    payloads.push({
      function: "0x1::aptos_account::transfer",
      functionArguments: [account.accountAddress, "1"], // 1 octa
    });
  }

  // Shuffle the payloads to mix failing and passing transactions
  for (let i = payloads.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [payloads[i], payloads[j]] = [payloads[j], payloads[i]];
  }

  return payloads;
}

function setupEventListeners(aptos: Aptos) {
  aptos.transaction.batch.on(
    TransactionWorkerEventsEnum.TransactionSent,
    (data) => {
      console.log(`Transaction sent: ${data.transactionHash}`);
    }
  );

  aptos.transaction.batch.on(
    TransactionWorkerEventsEnum.TransactionExecuted,
    (data) => {
      console.log(`Transaction executed: ${data.transactionHash}`);
    }
  );

  aptos.transaction.batch.on(
    TransactionWorkerEventsEnum.TransactionSendFailed,
    (data) => {
      console.error(`Transaction send failed: ${data.error}`);
    }
  );

  aptos.transaction.batch.on(
    TransactionWorkerEventsEnum.TransactionExecutionFailed,
    (data) => {
      console.error(`Transaction execution failed: ${data.error}`);
    }
  );

  aptos.transaction.batch.on(
    TransactionWorkerEventsEnum.ExecutionFinish,
    (data) => {
      console.log(`Execution finished: ${data.message}`);
    }
  );
}

async function submitTransactions(
  aptos: Aptos,
  account: Account,
  payloads: InputGenerateTransactionPayloadData[]
) {
  await aptos.transaction.batch.forSingleAccount({
    sender: account,
    data: payloads,
  });
}

async function waitForTransactionsToComplete(aptos: Aptos) {
  return new Promise<void>((resolve) => {
    aptos.transaction.batch.on(
      TransactionWorkerEventsEnum.ExecutionFinish,
      () => {
        resolve();
      }
    );
  });
}

async function verifyFinalAccountState(aptos: Aptos, account: Account) {
  const accountInfo = await aptos.getAccountInfo({
    accountAddress: account.accountAddress,
  });
  console.log(
    `Final sequence number for ${account.accountAddress.toString()}: ${
      accountInfo.sequence_number
    }`
  );
}

main().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});
