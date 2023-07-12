import ServiceBase from "@/Services/ServiceBase";
import type {
  PoolRevenue,
  ChainRevenue,
  ChainTopPoolRevenue,
} from "@CM/Pages/Platform/Revenue/Models/Revenue";

const HISTORICAL_POOL_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/historical/toppools/20";

const CHAIN_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/chains";

export default class PoolRevenueService extends ServiceBase {
  public async get(): Promise<PoolRevenue[]> {
    return this.fetch<{
      revenue: PoolRevenue[];
    }>(HISTORICAL_POOL_ENDPOINT).then((resp) => resp.revenue);
  }
}

export class ChainRevenueService extends ServiceBase {
  public async get(): Promise<ChainRevenue[]> {
    return this.fetch<{ revenue: ChainRevenue[] }>(CHAIN_REVENUE_ENDPOINT).then(
      (resp) => resp.revenue
    );
  }
}

export class ChainTopPoolsRevenueService extends ServiceBase {
  public async get(chain: string): Promise<ChainTopPoolRevenue[]> {
    const endpoint = `https://api-py.llama.airforce/curve/v1/protocol/revenue/${chain}/toppools/10`;

    return this.fetch<{ revenue: ChainTopPoolRevenue[] }>(endpoint).then(
      (resp) => resp.revenue
    );
  }
}
