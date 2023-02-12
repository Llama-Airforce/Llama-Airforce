import ServiceBase from "@/Services/ServiceBase";
import {HistoricalRevenue, ProtocolRevenue} from "@/Pages/Convex/Revenue/Models/Revenue";


const HISTORICAL_REVENUE_ENDPOINT =
  "http://api-py.llama.airforce/convex/v1/platform/revenue/snapshots?groupby=m";

const TOTAL_REVENUE_ENDPOINT =
  "http://api-py.llama.airforce/convex/v1/platform/revenue";


export class HistoricalRevenueResponse {
  revenue: HistoricalRevenue[];
}

export class ProtocolRevenueResponse {
  revenue: ProtocolRevenue[];
}

export default class ProtocolRevenueService extends ServiceBase {
  public async get(): Promise<ProtocolRevenue> {
    return this.fetch(TOTAL_REVENUE_ENDPOINT, ProtocolRevenueResponse)
      .then(
        (resp) => resp.revenue[0]
      );
  }
}

export class HistoricalRevenueService extends ServiceBase {
  public async get(): Promise<HistoricalRevenue[]> {
    return this.fetch(HISTORICAL_REVENUE_ENDPOINT, HistoricalRevenueResponse)
      .then(
        (resp) => resp.revenue
      );
  }
}


