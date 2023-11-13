import { type Observable, filter, map, shareReplay } from "rxjs";
import { type WebSocketSubject, webSocket } from "rxjs/webSocket";
import { type Collateral } from "@PM/Models/Collateral";

export const WS_URL = "wss://api.prismamonitor.com/v1/prisma/ws";
export const TROVE_OVERVIEW_CHANNEL = "troves_overview" as const;

type GenericMessage = {
  channel: string;
  action: Action;
};

type Action = "subscribe" | "unsubscribe" | "snapshots";
type PayloadType = "update" | "snapshot";

export type TroveManagerDetails = {
  name: Collateral;
  address: string;
  collateral: string;
  tvl: number;
  debt: number;
  debt_cap: number;
  cr: number;
  mcr: number;
  rate: number;
  price: number;
  open_troves: number;
  closed_troves: number;
  liq_troves: number;
  red_troves: number;
};

type TroveOverviewSettings = {
  chain: string;
};

type TroveOverviewPayload = {
  channel: string;
  subscription: TroveOverviewSettings;
  type: PayloadType;
  payload: TroveManagerDetails[];
};

type TroveOverviewRequest = GenericMessage & {
  channel: typeof TROVE_OVERVIEW_CHANNEL;
  settings: TroveOverviewSettings[];
};

let subject: WebSocketSubject<unknown> | null = null;
let overview$: Observable<TroveManagerDetails[]> | null = null;

export class TroveOverviewService {
  constructor(private chain: string) {
    if (subject) {
      this.send("snapshots");
      return;
    }

    subject = subject ?? webSocket(WS_URL);

    overview$ = subject.pipe(
      map((x) => x as TroveOverviewPayload),
      filter(
        (x) =>
          x.subscription.chain === this.chain &&
          x.channel === TROVE_OVERVIEW_CHANNEL
      ),
      map((x) => x.payload),
      shareReplay(1)
    );

    this.send("subscribe");
    this.send("snapshots");
  }

  get overview$() {
    return overview$!;
  }

  private send(action: Action): void {
    const req: TroveOverviewRequest = {
      action,
      channel: TROVE_OVERVIEW_CHANNEL,
      settings: [
        {
          chain: this.chain,
        },
      ],
    };

    subject!.next(req);
  }
}
