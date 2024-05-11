import { ServiceBase } from "@/Services";
import {
  type HistoricalRevenue,
  type ProtocolRevenue,
} from "@CM/Pages/Convex/Revenue/Models/Revenue";

const HISTORICAL_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/convex/v1/platform/revenue/snapshots?groupby=m";

const TOTAL_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/convex/v1/platform/revenue";

export default class ProtocolRevenueService extends ServiceBase {
  public get(): Promise<ProtocolRevenue> {
    return this.fetch<{ revenue: ProtocolRevenue[] }>(
      TOTAL_REVENUE_ENDPOINT
    ).then((resp) => resp.revenue[0]);
  }
}

export class HistoricalRevenueService extends ServiceBase {
  public get(): Promise<HistoricalRevenue[]> {
    return this.fetch<{ revenue: HistoricalRevenue[] }>(
      HISTORICAL_REVENUE_ENDPOINT
    ).then((resp) => resp.revenue);
  }
}
