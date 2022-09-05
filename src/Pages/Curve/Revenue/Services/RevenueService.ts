import ServiceBase from "@/Services/ServiceBase";
import PoolRevenue, {ChainRevenue} from "@/Pages/Curve/Revenue/Models/Revenue";

const HISTORICAL_POOL_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/toppools/20";

const CHAIN_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/chains"

export class PoolRevenueResponse {
  revenue: PoolRevenue[];
}

export class ChainRevenueResponse {
  revenue: ChainRevenue[];
}

export default class PoolRevenueService extends ServiceBase {
  public async get(): Promise<PoolRevenue[]> {

    return this.fetch(HISTORICAL_POOL_ENDPOINT, PoolRevenueResponse)
      .then(
        (resp) => resp.revenue);
  }
}

export class ChainRevenueService extends ServiceBase {
  public async get(): Promise<ChainRevenue[]> {

    return this.fetch(CHAIN_REVENUE_ENDPOINT, ChainRevenueResponse)
      .then(
        (resp) => resp.revenue);
  }
}
