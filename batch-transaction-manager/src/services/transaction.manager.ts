//@ts-nocheck
import {
  Account,
  Aptos,
  AptosConfig,
  InputGenerateTransactionOptions,
  InputGenerateTransactionPayloadData,
  PendingTransactionResponse,
  TransactionResponse,
} from "@aptos-labs/ts-sdk";
import { AsyncQueue } from "./asyncQueue";

class TransactionError extends Error {
  constructor(message: string, public txHash: string) {
    super(message);
    this.name = "TransactionError";
  }
}

enum TransactionStatus {
  Pending,
  Submitted,
  Confirmed,
  Failed,
}

interface Transaction {
  payload: InputGenerateTransactionPayloadData;
  options?: InputGenerateTransactionOptions;
  status: TransactionStatus;
  hash?: string;
  retryCount: number;
}

export class EnhancedTransactionProcessor {
  private aptos: Aptos;
  private mainQueue: AsyncQueue<Transaction>;
  private waitingQueue: AsyncQueue<Transaction>;
  private maxRetries: number;
  private maxInFlight: number;
  private isRunning: boolean = false;

  constructor(
    private aptosConfig: AptosConfig,
    private account: Account,
    maxInFlight: number = 100,
    maxRetries: number = 3
  ) {
    this.aptos = new Aptos(aptosConfig);
    this.mainQueue = new AsyncQueue<Transaction>();
    this.waitingQueue = new AsyncQueue<Transaction>();
    this.maxRetries = maxRetries;
    this.maxInFlight = maxInFlight;
  }

  async start() {
    this.isRunning = true;
    this.processMainQueue().catch(this.handleUnexpectedError);
    this.processWaitingQueue().catch(this.handleUnexpectedError);
  }

  async stop() {
    this.isRunning = false;
  }

  async push(payload: InputGenerateTransactionPayloadData, options?: InputGenerateTransactionOptions) {
    const transaction: Transaction = {
      payload,
      options,
      status: TransactionStatus.Pending,
      retryCount: 0,
    };

    if (this.mainQueue.isEmpty() && this.waitingQueue.isEmpty()) {
      await this.mainQueue.enqueue(transaction);
    } else {
      await this.waitingQueue.enqueue(transaction);
    }
  }

  private async processMainQueue() {
    while (this.isRunning) {
      try {
        if (!this.mainQueue.isEmpty()) {
          const transaction = await this.mainQueue.dequeue();
          await this.processTransaction(transaction);
        } else {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        this.handleUnexpectedError(error);
      }
    }
  }

  private async processWaitingQueue() {
    while (this.isRunning) {
      try {
        if (this.mainQueue.isEmpty() && !this.waitingQueue.isEmpty()) {
          const transaction = await this.waitingQueue.dequeue();
          await this.mainQueue.enqueue(transaction);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        this.handleUnexpectedError(error);
      }
    }
  }

  private async processTransaction(transaction: Transaction) {
    try {
      transaction.status = TransactionStatus.Submitted;
      const pendingTxn = await this.submitTransaction(transaction);
      transaction.hash = pendingTxn.hash;
      
      const txnResponse = await this.waitForTransaction(pendingTxn.hash);
      if ((txnResponse as any).success) {
        transaction.status = TransactionStatus.Confirmed;
        console.log(`Transaction ${pendingTxn.hash} confirmed`);
      } else {
        throw new TransactionError(`Transaction ${pendingTxn.hash} failed`, pendingTxn.hash);
      }
    } catch (error) {
      console.error(`Error processing transaction:`, error);
      transaction.status = TransactionStatus.Failed;
      await this.handleTransactionError(transaction, error);
    }
  }

  private async submitTransaction(transaction: Transaction): Promise<PendingTransactionResponse> {
    try {
      const txn = await this.aptos.transaction.build.simple({
        sender: this.account.accountAddress,
        data: transaction.payload,
        options: transaction.options,
      });
      const signedTxn = await this.aptos.transaction.sign({ signer: this.account, transaction: txn });
      return this.aptos.transaction.submit.simple(signedTxn);
    } catch (error) {
      console.error(`Error submitting transaction:`, error);
      throw new TransactionError(`Submission failed: ${(error as Error).message}`, transaction.hash || "unknown");
    }
  }

  private async waitForTransaction(txnHash: string): Promise<TransactionResponse> {
    try {
      return await this.aptos.waitForTransaction({ transactionHash: txnHash });
    } catch (error) {
      console.error(`Error waiting for transaction ${txnHash}:`, error);
      throw new TransactionError(`Wait failed: ${(error as Error).message}`, txnHash);
    }
  }

  private async handleTransactionError(transaction: Transaction, error: unknown) {
    if (transaction.retryCount < this.maxRetries) {
      transaction.retryCount++;
      transaction.status = TransactionStatus.Pending;
      await this.waitingQueue.enqueue(transaction);
      console.log(`Retrying transaction ${transaction.hash}, attempt ${transaction.retryCount}`);
    } else {
      await this.logFailedTransaction(transaction, error);
    }
  }

  private handleUnexpectedError = (error: unknown) => {
    console.error("Unexpected error in transaction processing:", error);
    // Implement additional error handling logic here (e.g., alerting, logging)
  }

  private async logFailedTransaction(transaction: Transaction, error: unknown) {
    console.error(`Transaction ${transaction.hash} permanently failed:`, error);
    // Implement additional logging logic here (e.g., write to a database or log file)
  }
}
