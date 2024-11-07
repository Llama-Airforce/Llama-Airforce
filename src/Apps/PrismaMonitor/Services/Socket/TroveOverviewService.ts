import { type Observable, filter, map, shareReplay } from "rxjs";
import type { WebSocketSubject } from "rxjs/webSocket";
import type { Payload, Action, Request } from "@/Services";
import type { Vault } from "@PM/Models/Vault";

export const TROVE_OVERVIEW_CHANNEL = "troves_overview";

export type TroveManagerDetails = {
  name: string;
  address: Vault;
  collateral: string; // Address
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

type TroveOverviewRequestSettings = {
  chain: string;
};

let overview$: Observable<TroveManagerDetails[]> | null = null;

export default class TroveOverviewService {
  private socket: WebSocketSubject<unknown>;

  constructor(socket: unknown, private chain: string) {
    this.socket = socket as WebSocketSubject<unknown>;

    if (overview$) {
      this.send("snapshots");
      return;
    }

    overview$ = this.socket.pipe(
      map(
        (x) => x as Payload<TroveManagerDetails, TroveOverviewRequestSettings>
      ),
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
    const req: Request<
      TroveOverviewRequestSettings,
      typeof TROVE_OVERVIEW_CHANNEL
    > = {
      action,
      channel: TROVE_OVERVIEW_CHANNEL,
      settings: [
        {
          chain: this.chain,
        },
      ],
    };

    this.socket.next(req);
  }
}
