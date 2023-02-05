import { Observable } from "rxjs";
import type { Balances } from "@/Pages/CurveMonitor/Models";
import type {
  BalancesDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class BalanceService {
  public readonly get$: Observable<Balances>;

  constructor(socket: SocketPool) {
    this.get$ = new Observable((subscriber) => {
      const onData = (data: BalancesDto | BalancesDto[]) => {
        const reserves = Array.isArray(data)
          ? data.map((d) => this.get(d))
          : [this.get(data)];

        for (const reserve of reserves) {
          subscriber.next(reserve);
        }
      };

      socket.on("balances_chart", onData);
      socket.on("Update Balance-Chart", onData);

      return () => {
        socket.off("balances_chart", onData);
        socket.off("Update Balance-Chart", onData);
      };
    });
  }

  private get(balances: BalancesDto): Balances {
    const key = Object.keys(balances)[0];

    const timestamp = parseInt(key, 10);
    const values = balances[key];

    const bs: Balances = {
      timestamp,
      balances: values,
    };

    return bs;
  }
}
