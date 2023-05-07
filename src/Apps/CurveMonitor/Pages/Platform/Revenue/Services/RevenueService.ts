import ServiceBase from "@/Services/ServiceBase";
import PoolRevenue, {
  ChainRevenue,
  ChainTopPoolRevenue,
} from "@CM/Pages/Platform/Revenue/Models/Revenue";

const HISTORICAL_POOL_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/historical/toppools/20";

const CHAIN_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/chains";

export class PoolRevenueResponse {
  revenue: PoolRevenue[];
}

export class ChainRevenueResponse {
  revenue: ChainRevenue[];
}

export class ChainTopPoolRevenueResponse {
  revenue: ChainTopPoolRevenue[];
}

export default class PoolRevenueService extends ServiceBase {
  public async get(): Promise<PoolRevenue[]> {
    return this.fetch(HISTORICAL_POOL_ENDPOINT, PoolRevenueResponse).then(
      (resp) => resp.revenue
    );
  }
}

export class ChainRevenueService extends ServiceBase {
  public async get(): Promise<ChainRevenue[]> {
    return this.fetch(CHAIN_REVENUE_ENDPOINT, ChainRevenueResponse).then(
      (resp) => resp.revenue
    );
  }
}

export class ChainTopPoolsRevenueService extends ServiceBase {
  public async get(chain: string): Promise<ChainTopPoolRevenue[]> {
    const endpoint = `https://api-py.llama.airforce/curve/v1/protocol/revenue/${chain}/toppools/10`;
    return this.fetch(endpoint, ChainTopPoolRevenueResponse).then(
      (resp) => resp.revenue
    );
  }
}
