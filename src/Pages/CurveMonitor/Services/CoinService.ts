import { Observable, share } from "rxjs";
import type { Coin } from "@/Pages/CurveMonitor/Models";
import type {
  NamesDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class CoinService {
  public readonly get$: Observable<Coin[]>;

  constructor(socket: SocketPool) {
    this.get$ = new Observable<Coin[]>((subscriber) => {
      const onData = (data: NamesDto) => {
        const coins = this.get(data);
        subscriber.next(coins);
      };

      socket.on("token names inside pool", onData);

      return () => {
        socket.off("token names inside pool", onData);
      };
    }).pipe(share());
  }

  private get(names: NamesDto): Coin[] {
    return names.map((name) => ({
      name,
    }));
  }
}
