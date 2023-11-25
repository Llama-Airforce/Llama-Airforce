import { type Observable, filter, map, shareReplay } from "rxjs";
import { type WebSocketSubject } from "rxjs/webSocket";
import {
  type Action,
  type Payload,
  type Request,
} from "@/Services/Socket/Models";

const OHLC_CHANNEL = "pool_volume" as const;

export type Volume = {
  timestamp: number;
  volume: number;
};

export type VolumeRequestSettings = {
  pool: string;
  chain: string;
  interval: "hour" | "day";
  start?: number;
  end?: number;
};

/** Docs: https://curve-prices.gitbook.io/curve-prices-websocket-documentation/ */
export class CurveVolumeService {
  private socket: WebSocketSubject<unknown>;

  public readonly volume$: Observable<Volume[]>;

  constructor(
    socket: unknown,
    private chain: string,
    private settings: VolumeRequestSettings
  ) {
    this.socket = socket as WebSocketSubject<unknown>;

    this.volume$ = this.socket.pipe(
      map((x) => x as Payload<Volume, VolumeRequestSettings>),
      filter(
        (x) =>
          x.subscription.chain === this.chain &&
          x.channel === OHLC_CHANNEL &&
          JSON.stringify(x.subscription) === JSON.stringify(settings)
      ),
      map((x) => x.payload),
      shareReplay(1)
    );

    this.send("snapshots");
  }

  private send(action: Action): void {
    const req: Request<VolumeRequestSettings, typeof OHLC_CHANNEL> = {
      action,
      channel: OHLC_CHANNEL,
      settings: [this.settings],
    };

    this.socket.next(req);
  }
}
