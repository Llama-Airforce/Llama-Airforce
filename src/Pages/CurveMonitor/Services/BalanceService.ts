import { Observable } from "rxjs";
import type { Balances } from "@/Pages/CurveMonitor/Models";
import type {
  BalancesDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class BalanceService {
  public readonly init$: Observable<Balances[]>;
  public readonly update$: Observable<Balances>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable((subscriber) => {
      const onData = (data: BalancesDto[]) => {
        const xs = data.map((d) => this.map(d));
        subscriber.next(xs);
      };

      socket.on("balances_chart", onData);

      return () => {
        socket.off("balances_chart", onData);
      };
    });

    this.update$ = new Observable((subscriber) => {
      const onData = (data: BalancesDto) => {
        const x = this.map(data);
        subscriber.next(x);
      };

      socket.on("Update Balance-Chart", onData);

      return () => {
        socket.off("Update Balance-Chart", onData);
      };
    });
  }

  private map(balances: BalancesDto): Balances {
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
