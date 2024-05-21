import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models/Chain";
import type * as ApiTypes from "@CM/Services/Llamma/ApiTypes";
import * as Parsers from "@CM/Services/Llamma/Parsers";

const API_URL = "https://prices.curve.fi";

export type Endpoint = "crvusd" | "lending";

export default class LlammaService extends ServiceBase {
  public async getEvents(
    endpoint: Endpoint,
    chain: Chain,
    llamma: string,
    page: number
  ) {
    const resp = await this.fetch<ApiTypes.GetLlammaEventsResponse>(
      `${API_URL}/v1/${endpoint}/llamma_events/${chain}/${llamma}?page=${page}&per_page=10`
    );

    return {
      trades: resp.data.map(Parsers.parseEvents),
      count: resp.count,
    };
  }

  public async getTrades(
    endpoint: Endpoint,
    chain: Chain,
    llamma: string,
    page: number
  ) {
    const resp = await this.fetch<ApiTypes.GetLlammaTradesResponse>(
      `${API_URL}/v1/${endpoint}/llamma_trades/${chain}/${llamma}?page=${page}&per_page=10`
    );

    return {
      trades: resp.data.map(Parsers.parseTrades),
      count: resp.count,
    };
  }

  public async getOHLC(endpoint: Endpoint, chain: Chain, llamma: string) {
    const end = Math.floor(new Date().getTime() / 1000);
    const start = end - 10 * 24 * 60 * 60; // Subtract 1 month worth of seconds.

    const resp = await this.fetch<ApiTypes.GetLlammaOHLCResponse>(
      `${API_URL}/v1/${endpoint}/llamma_ohlc/${chain}/${llamma}?agg_number=1&agg_units=hour&start=${start}&end=${end}`
    );

    return resp.data.map(Parsers.parseOHLC);
  }
}
