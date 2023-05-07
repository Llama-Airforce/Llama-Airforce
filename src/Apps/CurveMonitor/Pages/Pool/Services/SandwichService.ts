import { Observable, share } from "rxjs";
import type { Sandwich } from "@CM/Pages/Pool/Models";
import type { SandwichDto, SocketPool } from "@CM/Services/Sockets";
import { map as mapTx } from "@CM/Pages/Pool/Services/TransactionService";

export default class SandwichService {
  public readonly init$: Observable<Sandwich[]>;
  public readonly update$: Observable<Sandwich>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable<Sandwich[]>((subscriber) => {
      const onData = (data: SandwichDto[]) => {
        const xs = data.map((d) => map(d));
        subscriber.next(xs);
      };

      socket.on("table_mev", onData);

      return () => {
        socket.off("table_mev", onData);
      };
    }).pipe(share());

    this.update$ = new Observable<Sandwich>((subscriber) => {
      const onData = (data: SandwichDto) => {
        const x = map(data);
        subscriber.next(x);
      };

      socket.on("Update Table-MEV", onData);

      return () => {
        socket.off("Update Table-MEV", onData);
      };
    }).pipe(share());
  }
}

export function map(sw: SandwichDto): Sandwich {
  const blockNumber = sw.blockNumber;
  const timestamp = sw.unixtime;
  const txs = sw.tx.map((txs) => mapTx(txs)).flat(1);

  return {
    blockNumber,
    timestamp,
    profit: sw.profit,
    profitUnit: sw.profitUnit,
    loss: sw.loss,
    lossUnit: sw.lossUnit,
    txs,
  };
}
