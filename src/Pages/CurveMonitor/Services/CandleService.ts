import { Observable } from "rxjs";
import type { Candle } from "@/Pages/CurveMonitor/Models";
import type {
  PriceDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class TransactionService {
  public readonly get$: Observable<Candle>;

  constructor(socket: SocketPool) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.get$ = new Observable((subscriber) => {
      const onData = (data: PriceDto | PriceDto[]) => {
        const candles = Array.isArray(data)
          ? data.map((d) => this.get(d))
          : [this.get(data)];

        for (const candle of candles) {
          subscriber.next(candle);
        }
      };

      socket.on("price_chart", onData);
      socket.on("Update Price-Chart", onData);

      return () => {
        socket.off("price_chart", onData);
        socket.off("Update Price-Chart", onData);
      };
    });
  }

  private get(price: PriceDto): Candle {
    const key = Object.keys(price)[0];

    const timestamp = parseInt(key, 10);
    const open = price[key];
    const high = price[key];
    const low = price[key];
    const close = price[key];
    const token0TotalAmount = 0;

    const candle: Candle = {
      timestamp,
      open,
      high,
      low,
      close,
      token0TotalAmount,
    };

    return candle;
  }
}
