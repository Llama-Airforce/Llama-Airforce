import { WebSocketConnectionManager } from "@CM/Services/Sockets/CurvePrices/WebSocketService";
import { Action, PayloadType } from "@CM/Services/Sockets/CurvePrices/types";
import { type Observable, Subject } from "rxjs";
import { scan } from "rxjs/operators";

export interface OhlcModel {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface LlammaOhlcPayload {
  channel: string;
  type: PayloadType;
  payload: OhlcModel[];
}

export enum Interval {
  i15m = 60 * 15,
  i1h = 60 * 60,
  i4h = 60 * 60 * 4,
  i1d = 60 * 60 * 24,
}

export interface LlammaOhlcSettings {
  llamma: string;
  chain: string;
  interval: Interval;
  start?: number;
  end?: number;
}

export interface LlammaOhlcRequest {
  action: Action;
  channel: "crvusd_llamma_ohlc";
  settings: LlammaOhlcSettings[];
}

export class OHLCService {
  private wsManager: WebSocketConnectionManager;
  private dataSubject: Subject<LlammaOhlcPayload>;
  public data$: Observable<OhlcModel[]>;
  private currentOHLCData: OhlcModel[] = [];

  constructor(
    private url: string,
    private llamma: string,
    private chain: string,
    private interval: Interval,
    private start: number,
    private end: number
  ) {
    this.wsManager = WebSocketConnectionManager.getInstance();
    this.wsManager.connect(url);

    this.dataSubject = new Subject<LlammaOhlcPayload>();
    this.data$ = this.dataSubject.pipe(
      scan(
        (currentData, newPayload) =>
          this.reconcileData(currentData, newPayload),
        this.currentOHLCData
      )
    );

    this.wsManager.registerListener("crvusd_llamma_ohlc", (message) => {
      try {
        const payload = JSON.parse(message) as LlammaOhlcPayload;
        this.dataSubject.next(payload);
      } catch (error) {
        console.error(
          "Error parsing WebSocket message:",
          error,
          "Raw data:",
          message
        );
      }
    });

    this.requestSnapshots();
    this.subscribeToUpdates();
  }

  private requestSnapshots(): void {
    const request: LlammaOhlcRequest = {
      action: Action.snapshots,
      channel: "crvusd_llamma_ohlc",
      settings: [
        {
          llamma: this.llamma,
          chain: this.chain,
          start: this.start,
          end: this.end,
          interval: this.interval,
        },
      ],
    };

    this.send(request);
  }

  private subscribeToUpdates(): void {
    const request: LlammaOhlcRequest = {
      action: Action.subscribe,
      channel: "crvusd_llamma_ohlc",
      settings: [
        {
          llamma: this.llamma,
          chain: this.chain,
          interval: this.interval,
        },
      ],
    };

    this.send(request);
  }

  private reconcileData(
    currentData: OhlcModel[],
    newPayload: LlammaOhlcPayload
  ): OhlcModel[] {
    if (newPayload.type === PayloadType.snapshot) {
      return newPayload.payload;
    } else if (newPayload.type === PayloadType.update) {
      newPayload.payload.forEach((update) => {
        const index = currentData.findIndex(
          (item) => item.time === update.time
        );
        if (index !== -1) {
          currentData[index] = update;
        } else {
          currentData.push(update);
        }
      });
      return [...currentData];
    }
    return currentData;
  }

  private send(request: LlammaOhlcRequest): void {
    this.wsManager.send(JSON.stringify(request));
  }
}
