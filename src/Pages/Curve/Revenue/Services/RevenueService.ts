import ServiceBase from "@/Services/ServiceBase";
import PoolRevenue from "@/Pages/Curve/Revenue/Models/Revenue";

const ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/toppools/20";

export class PoolRevenueResponse {
  revenue: PoolRevenue[];
}

export default class PoolRevenueService extends ServiceBase {
  public async get(): Promise<PoolRevenue[]> {

    return this.fetch(ENDPOINT, PoolRevenueResponse).then(
      (resp) => resp.revenue);}
}
