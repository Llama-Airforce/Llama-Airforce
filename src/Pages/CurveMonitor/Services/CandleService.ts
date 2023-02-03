import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import type { Candle } from "@/Pages/CurveMonitor/Models";

type ClientToServerEvents = Record<string, never>;
type ServerToClientEvents = {
  price_chart: (dto: PriceDto[]) => void;
  "Update Price-Chart": (dto: PriceDto) => void;
};

type PriceDto = {
  [unixtime: string]: number;
};

export default class TransactionService {
  private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  public readonly get$: Observable<Candle>;

  constructor(url: string, poolAddress: string) {
    this.socket = io(`${url}/${poolAddress}`, {
      autoConnect: false,
      secure: true,
    });

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

      this.socket.on("price_chart", onData);
      this.socket.on("Update Price-Chart", onData);

      return () => {
        this.socket.off("price_chart", onData);
        this.socket.off("Update Price-Chart", onData);
      };
    });
  }

  public connect() {
    this.socket.connect();
  }

  public close() {
    this.socket.close();
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
