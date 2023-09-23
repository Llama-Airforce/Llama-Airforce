import { WebSocketConnectionManager } from '@PM/Services/Socket/WebSocketService';
import { Action, type PayloadType} from "@PM/Services/Socket/types";
import { ref } from "vue";

export const WS_URL = "wss://api.prismamonitor.com/v1/prisma/ws";
export const TROVE_OVERVIEW_CHANNEL = "troves_overview" as const;

export interface TroveManagerDetails {
  name: string;
  address: string;
  tvl: number;
  debt: number;
  cr: number;
  mcr: number;
  rate: number;
  price: number;
  open_troves: number;
  closed_troves: number;
  liq_troves: number;
  red_troves: number;
}

export interface TroveOverviewSettings {
  chain: string;
}

export interface TroveOverviewPayload {
  channel: string;
  subscription: TroveOverviewSettings;
  type: PayloadType;
  payload: TroveManagerDetails[];
}

export interface TroveOverviewRequest {
  action: Action;
  channel: typeof TROVE_OVERVIEW_CHANNEL;
  settings: TroveOverviewSettings[];
}

export class TroveOverviewService {
  private wsManager: WebSocketConnectionManager;
  public currentData = ref<TroveManagerDetails[]>([]);

  constructor(private chain: string) {
    this.wsManager = WebSocketConnectionManager.getInstance(WS_URL);
    this.wsManager.registerListener(TROVE_OVERVIEW_CHANNEL, chain, this.parseSubscriptionFromMessage, (message) => {
      try {
        const payload = JSON.parse(message) as TroveOverviewPayload;
        if (payload.subscription.chain === this.chain) {
          this.currentData.value = payload.payload;  // Update the current data
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error, "Raw data:", message);
      }
    });

    this.requestSnapshots();
    this.subscribeToUpdates();
  }

  public getCurrentData(): TroveManagerDetails[] {
    return this.currentData.value;
  }

  private requestSnapshots(): void {
    const request: TroveOverviewRequest = {
      action: Action.snapshots,
      channel: TROVE_OVERVIEW_CHANNEL,
      settings: [{
        chain: this.chain,
      }]
    };

    this.send(request);
  }

  private subscribeToUpdates(): void {
    const request: TroveOverviewRequest = {
      action: Action.subscribe,
      channel: TROVE_OVERVIEW_CHANNEL,
      settings: [{
        chain: this.chain,
      }]
    };

    this.send(request);
  }

  private parseSubscriptionFromMessage = (message: string): string => {
    const parsed = JSON.parse(message) as TroveOverviewPayload;
    return parsed.subscription.chain;
  };

  private send(request: TroveOverviewRequest): void {
    this.wsManager.send(JSON.stringify(request));
  }
}
