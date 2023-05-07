import { Observable, share } from "rxjs";
import type { Balances } from "@CM/Pages/Pool/Models";
import type { BalancesDto, SocketPool } from "@CM/Services/Sockets";

export default class BalanceService {
  public readonly init$: Observable<Balances[]>;
  public readonly update$: Observable<Balances>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable<Balances[]>((subscriber) => {
      const onData = (data: BalancesDto[]) => {
        const xs = data.map((d) => map(d));
        subscriber.next(xs);
      };

      socket.on("balances_chart", onData);

      return () => {
        socket.off("balances_chart", onData);
      };
    }).pipe(share());

    this.update$ = new Observable<Balances>((subscriber) => {
      const onData = (data: BalancesDto) => {
        const x = map(data);
        subscriber.next(x);
      };

      socket.on("Update Balance-Chart", onData);

      return () => {
        socket.off("Update Balance-Chart", onData);
      };
    }).pipe(share());
  }
}

export function map(balances: BalancesDto): Balances {
  const key = Object.keys(balances)[0];

  const timestamp = parseInt(key, 10);
  const values = balances[key];

  const bs: Balances = {
    timestamp,
    balances: values,
  };

  return bs;
}
