import { Observable, share } from "rxjs";
import { type SocketPool } from "@CM/Services/Sockets";
import { type TvlDto } from "@CM/Services/Sockets/SocketPool";
import type { Tvl } from "@CM/Services/MonitorLegacy";

export default class TvlService {
  public readonly init$: Observable<Tvl[]>;
  public readonly update$: Observable<Tvl>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable<Tvl[]>((subscriber) => {
      const onData = (data: TvlDto[]) => {
        const xs = data.map((d) => map(d));
        subscriber.next(xs);
      };

      socket.on("tvl_chart", onData);

      return () => {
        socket.off("tvl_chart", onData);
      };
    }).pipe(share());

    this.update$ = new Observable<Tvl>((subscriber) => {
      const onData = (data: TvlDto) => {
        const x = map(data);
        subscriber.next(x);
      };

      socket.on("Update TVL-Chart", onData);

      return () => {
        socket.off("Update TVL-Chart", onData);
      };
    }).pipe(share());
  }
}

export function map(tvl: TvlDto): Tvl {
  const key = Object.keys(tvl)[0];

  const timestamp = parseInt(key, 10);
  const value = tvl[key];

  const ts: Tvl = {
    timestamp,
    tvl: value,
  };

  return ts;
}
