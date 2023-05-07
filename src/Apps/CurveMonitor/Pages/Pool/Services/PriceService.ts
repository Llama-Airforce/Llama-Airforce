import { Observable, share } from "rxjs";
import type { Price } from "@CM/Pages/Pool/Models";
import type { PriceDto, SocketPool } from "@CM/Services/Sockets";

export default class PriceService {
  public readonly init$: Observable<Price[]>;
  public readonly update$: Observable<Price>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable<Price[]>((subscriber) => {
      const onData = (data: PriceDto[]) => {
        const xs = data.map((d) => map(d));
        subscriber.next(xs);
      };

      socket.on("price_chart", onData);

      return () => {
        socket.off("price_chart", onData);
      };
    }).pipe(share());

    this.update$ = new Observable<Price>((subscriber) => {
      const onData = (data: PriceDto) => {
        const x = map(data);
        subscriber.next(x);
      };

      socket.on("Update Price-Chart", onData);

      return () => {
        socket.off("Update Price-Chart", onData);
      };
    }).pipe(share());
  }
}

export function map(price: PriceDto): Price {
  const key = Object.keys(price)[0];

  const timestamp = parseInt(key, 10);
  const value = price[key];

  const candle: Price = {
    timestamp,
    value,
  };

  return candle;
}
