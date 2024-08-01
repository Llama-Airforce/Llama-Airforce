import { Observable, share } from "rxjs";
import type { Pair, TimeRange } from "@CM/Models";
import { type SocketPool } from "@CM/Services/MonitorLegacy";
import { type PairDto } from "@CM/Services/MonitorLegacy/SocketPool";

export default class PairService {
  private readonly socket: SocketPool;

  public readonly update$: Observable<Pair>;

  constructor(socket: SocketPool) {
    this.socket = socket;

    this.update$ = new Observable<Pair>((subscriber) => {
      const onData = (data: PairDto) => {
        subscriber.next(data);
      };

      socket.on("price_chart_combination", onData);

      return () => {
        socket.off("price_chart_combination", onData);
      };
    }).pipe(share());
  }

  /** This does not update the time, but is for getting the correct timerange data of the new pair!  */
  update(timeRange: TimeRange, pair: Pair) {
    this.socket.emit("new combination", [timeRange, pair[0], pair[1]]);
  }
}
