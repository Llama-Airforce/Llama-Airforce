import { Observable } from "rxjs";
import type { Tvl } from "@/Pages/CurveMonitor/Models";
import type { TvlDto, SocketPool } from "@/Pages/CurveMonitor/Services/Sockets";

export default class TvlService {
  public readonly get$: Observable<Tvl>;

  constructor(socket: SocketPool) {
    this.get$ = new Observable((subscriber) => {
      const onData = (data: TvlDto | TvlDto[]) => {
        const tvls = Array.isArray(data)
          ? data.map((d) => this.get(d))
          : [this.get(data)];

        for (const tvl of tvls) {
          subscriber.next(tvl);
        }
      };

      socket.on("tvl_chart", onData);
      socket.on("Update TVL-Chart", onData);

      return () => {
        socket.off("tvl_chart", onData);
        socket.off("Update TVL-Chart", onData);
      };
    });
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
