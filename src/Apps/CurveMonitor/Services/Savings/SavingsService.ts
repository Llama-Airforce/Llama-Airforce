import { ServiceBase } from "@/Services";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://prices.curve.fi";

export default class SavingsService extends ServiceBase {
  public async getStatistics() {
    const resp = await this.fetch<ApiTypes.GetStatisticsResponse>(
      `${API_URL}/v1/crvusd/savings/statistics`
    );

    return Parsers.parseStatistics(resp);
  }

  public async getEvents(page: number) {
    const resp = await this.fetch<ApiTypes.GetEventsResponse>(
      `${API_URL}/v1/crvusd/savings/events?page=${page}&per_page=10`
    );

    return {
      count: resp.count,
      events: resp.events.map(Parsers.parseEvent),
    };
  }

  public async getYield() {
    const end = Math.floor(new Date().getTime() / 1000);
    const start = end - 10 * 24 * 60 * 60; // Subtract 1 month worth of seconds.

    const resp = await this.fetch<ApiTypes.GetYieldResponse>(
      `${API_URL}/v1/crvusd/savings/yield?agg_number=1&agg_units=hour&start=${start}&end=${end}`
    );

    return resp.data.map(Parsers.parseYield);
  }

  public async getRevenue(page: number) {
    const resp = await this.fetch<ApiTypes.GetRevenueResponse>(
      `${API_URL}/v1/crvusd/savings/revenue${page}&per_page=100`
    );

    return {
      totalDistributed: resp.total_distributed,
      history: resp.history.map(Parsers.parseRevenue),
    };
  }
}
