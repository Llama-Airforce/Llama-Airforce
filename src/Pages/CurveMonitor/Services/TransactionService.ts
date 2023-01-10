import Transactions from "@/Pages/CurveMonitor/Json/Transactions.json";
import type {
  Pool,
  Transaction,
  TransactionType,
} from "@/Pages/CurveMonitor/Models";
import {
  Swap,
  Deposit,
  Withdraw,
} from "@/Pages/CurveMonitor/Models/Transaction";

type TransactionDto = {
  type: "swap" | "deposit" | "remove";
};

type TransactionDtoSwap = TransactionDto & {
  type: "swap";
  tradeDetails: {
    amountIn: number;
    nameIn: string;
    amountOut: number;
    nameOut: string;
    feeUSD: number;
    valueUSD: number;
  };
};

type TransactionDtoDeposit = TransactionDto & {
  type: "deposit";
  tradeDetails: {
    amountIn: number;
    nameIn: string;
    valueUSD: number;
  }[];
};

type TransactionDtoRemove = TransactionDto & {
  type: "remove";
  tradeDetails: {
    amountOut: number;
    nameOut: string;
    valueUSD: number;
  }[];
};

export default class TransactionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, max-lines-per-function
  async get(pool: Pool): Promise<Transaction[]> {
    const txs: Transaction[] = Transactions[
      "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD"
    ]
      .map((tx) => {
        let type: TransactionType = "swap";
        if (tx.type === "deposit") {
          type = "deposit";
        } else if (tx.type === "remove") {
          type = "withdraw";
        }

        const txHash = tx.txHash.toLocaleLowerCase() as Lowercase<string>;
        const blockNumber = tx.blockNumber;
        const trader = tx.trader.toLocaleLowerCase() as Lowercase<string>;
        const timestamp = tx.unixtime;

        let transaction: Swap[] | Deposit[] | Withdraw[];

        if (type === "swap") {
          const swap = tx as TransactionDtoSwap;

          transaction = [
            {
              type,
              txHash,
              blockNumber,
              trader,
              timestamp,
              fee: swap.tradeDetails.feeUSD,
              value: swap.tradeDetails.valueUSD,
              amountIn: swap.tradeDetails.amountIn,
              amountOut: swap.tradeDetails.amountOut,
              tokenIn: swap.tradeDetails.nameIn,
              tokenOut: swap.tradeDetails.nameOut,
            },
          ];

          return transaction;
        } else if (type === "deposit") {
          const swap = tx as TransactionDtoDeposit;

          transaction = swap.tradeDetails.map((td) => ({
            type: "deposit",
            txHash,
            blockNumber,
            trader,
            timestamp,
            value: td.valueUSD,
            amountIn: td.amountIn,
            tokenIn: td.nameIn,
          }));
        } else {
          const swap = tx as TransactionDtoRemove;

          transaction = swap.tradeDetails.map((td) => ({
            type: "withdraw",
            txHash,
            blockNumber,
            trader,
            timestamp,
            value: td.valueUSD,
            amountOut: td.amountOut,
            tokenOut: td.nameOut,
          }));
        }

        return transaction;
      })
      .flat(1);

    return Promise.resolve(txs);
  }
}
