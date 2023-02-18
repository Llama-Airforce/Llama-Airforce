import { Observable, share } from "rxjs";
import type { Tvl } from "@/Pages/CurveMonitor/Models";
import type { TvlDto, SocketPool } from "@/Pages/CurveMonitor/Services/Sockets";

export default class TvlService {
  public readonly init$: Observable<Tvl[]>;
  public readonly update$: Observable<Tvl>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable<Tvl[]>((subscriber) => {
      const onData = (data: TvlDto[]) => {
        const xs = data.map((d) => this.get(d));
        subscriber.next(xs);
      };

      socket.on("tvl_chart", onData);

      return () => {
        socket.off("tvl_chart", onData);
      };
    }).pipe(share());

    this.update$ = new Observable<Tvl>((subscriber) => {
      const onData = (data: TvlDto) => {
        const x = this.get(data);
        subscriber.next(x);
      };

      socket.on("Update TVL-Chart", onData);

      return () => {
        socket.off("Update TVL-Chart", onData);
      };
    }).pipe(share());
  }

  private get(tvl: TvlDto): Tvl {
    const key = Object.keys(tvl)[0];

    const timestamp = parseInt(key, 10);
    const value = tvl[key];

    const ts: Tvl = {
      timestamp,
      tvl: value,
    };

    return ts;
  }
}
