import { WebSocketService } from '@CM/Services/Sockets/CurvePrices/WebSocketService';
import {type Action, type PayloadType} from "@CM/Services/Sockets/CurvePrices/types";

export interface OhlcModel {
  time: number;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
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
  i1d = 60 * 60 * 24
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
  settings: LlammaOhlcSettings;
}

export class OHLCService {
  private wsService: WebSocketService;

  constructor(url: string) {
    this.wsService = new WebSocketService(url);

    this.wsService.on('message', (rawData: string) => {
      try {
        const parsedData = JSON.parse(rawData) as LlammaOhlcPayload;
      } catch (error) {
        console.error("Failed to parse OHLC data:", error);
      }});
  }

  public subscribeToOHLC(data: LlammaOhlcRequest) {
    const formattedData = JSON.stringify(data);
    this.wsService.send(formattedData);
  }

}
