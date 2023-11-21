import { type Observable, filter, map, shareReplay } from "rxjs";
import { type WebSocketSubject } from "rxjs/webSocket";
import {
  type Action,
  type Payload,
  type Request,
} from "@/Services/Socket/Models";

export const WS_URL = "wss://prices.curve.fi/v1/stream/ws";
export const OHLC_CHANNEL = "pool_ohlc" as const;

export type OHLC = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
};

export type OHLCRequestSettings = {
  pool: string;
  chain: string;
  main_token: string;
  reference_token: string;
  interval: number;
  start?: number;
  end?: number;
};

/** Docs: https://curve-prices.gitbook.io/curve-prices-websocket-documentation/ */
export class CurvePriceService {
  private socket: WebSocketSubject<unknown>;

  public readonly ohlc$: Observable<OHLC[]>;

  constructor(
    socket: unknown,
    private chain: string,
    private settings: OHLCRequestSettings
  ) {
    this.socket = socket as WebSocketSubject<unknown>;

    this.ohlc$ = this.socket.pipe(
      map((x) => x as Payload<OHLC, OHLCRequestSettings>),
      filter(
        (x) => x.subscription.chain === this.chain && x.channel === OHLC_CHANNEL
      ),
      map((x) => x.payload),
      shareReplay(1)
    );

    this.send("snapshots");
  }

  private send(action: Action): void {
    const req: Request<OHLCRequestSettings, typeof OHLC_CHANNEL> = {
      action,
      channel: OHLC_CHANNEL,
      settings: [this.settings],
    };

    this.socket.next(req);
  }
}
