import { Observable, share } from "rxjs";
import type {
  Transaction,
  TransactionType,
  Swap,
  Deposit,
  Withdraw,
} from "@CM/Pages/Pool/Models";
import type {
  SocketPool,
  TransactionDto,
  TransactionDtoDeposit,
  TransactionDtoRemove,
  TransactionDtoSwap,
} from "@CM/Services/Sockets";

export default class TransactionService {
  public readonly init$: Observable<Transaction[]>;
  public readonly update$: Observable<Transaction>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable<Transaction[]>((subscriber) => {
      const onData = (data: TransactionDto[]) => {
        const xs = data.map((d) => map(d)).flat(1);
        subscriber.next(xs);
      };

      socket.on("table_all", onData);

      return () => {
        socket.off("table_all", onData);
      };
    }).pipe(share());

    this.update$ = new Observable<Transaction>((subscriber) => {
      const onData = (data: TransactionDto) => {
        const xs = map(data);

        for (const x of xs) {
          subscriber.next(x);
        }
      };

      socket.on("Update Table-ALL", onData);

      return () => {
        socket.off("Update Table-ALL", onData);
      };
    }).pipe(share());
  }
}

export function map(tx: TransactionDto): Transaction[] {
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
