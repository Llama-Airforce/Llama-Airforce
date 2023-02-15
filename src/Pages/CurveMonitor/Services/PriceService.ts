import { Observable } from "rxjs";
import type { Price } from "@/Pages/CurveMonitor/Models";
import type {
  PriceDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class PriceService {
  public readonly init$: Observable<Price[]>;
  public readonly update$: Observable<Price>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable((subscriber) => {
      const onData = (data: PriceDto[]) => {
        const xs = data.map((d) => this.get(d));
        subscriber.next(xs);
      };

      socket.on("price_chart", onData);

      return () => {
        socket.off("price_chart", onData);
      };
    });

    this.update$ = new Observable((subscriber) => {
      const onData = (data: PriceDto) => {
        const x = this.get(data);
        subscriber.next(x);
      };

      socket.on("Update Price-Chart", onData);

      return () => {
        socket.off("Update Price-Chart", onData);
      };
    });
  }

  private get(price: PriceDto): Price {
    const key = Object.keys(price)[0];

    const timestamp = parseInt(key, 10);
    const value = price[key];

    const candle: Price = {
      timestamp,
      value,
    };

    return candle;
  }
}
