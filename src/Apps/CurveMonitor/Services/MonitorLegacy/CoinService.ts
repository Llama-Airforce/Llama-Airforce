import { Observable, share } from "rxjs";
import type { Coin } from "@CM/Models";
import { type SocketPool } from "@CM/Services/MonitorLegacy";
import { type NamesDto } from "@CM/Services/MonitorLegacy/SocketPool";

export default class CoinService {
  public readonly get$: Observable<Coin[]>;

  constructor(socket: SocketPool) {
    this.get$ = new Observable<Coin[]>((subscriber) => {
      const onData = (data: NamesDto) => {
        const coins = map(data);
        subscriber.next(coins);
      };

      socket.on("token names inside pool", onData);

      return () => {
        socket.off("token names inside pool", onData);
      };
    }).pipe(share());
  }
}

export function map(names: NamesDto): Coin[] {
  return names.map((name) => ({
    name,
  }));
}
