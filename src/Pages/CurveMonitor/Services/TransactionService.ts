import { Observable } from "rxjs";
import type { Transaction, TransactionType } from "@/Pages/CurveMonitor/Models";
import type {
  Swap,
  Deposit,
  Withdraw,
} from "@/Pages/CurveMonitor/Models/Transaction";
import type {
  SocketPool,
  TransactionDto,
  TransactionDtoDeposit,
  TransactionDtoRemove,
  TransactionDtoSwap,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class TransactionService {
  public readonly get$: Observable<Transaction>;

  constructor(socket: SocketPool) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.get$ = new Observable((subscriber) => {
      const onData = (data: TransactionDto | TransactionDto[]) => {
        const txs = Array.isArray(data)
          ? data.map((d) => this.get(d)).flat(1)
          : this.get(data);

        for (const tx of txs) {
          subscriber.next(tx);
        }
      };

      socket.on("table_all", onData);
      socket.on("Update Table-ALL", onData);

      return () => {
        socket.off("table_all", onData);
        socket.off("Update Table-ALL", onData);
      };
    });
  }

  private get(tx: TransactionDto): Transaction[] {
    let type: TransactionType;
    if (tx.type === "swap") {
      type = "swap";
    } else if (tx.type === "deposit") {
      type = "deposit";
    } else if (tx.type === "remove") {
      type = "withdraw";
    } else {
      // Unsupported message type.
      return [];
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
  }
}
