import ServiceBase from "@/Services/ServiceBase";
import type {
  PoolRevenue,
  ChainRevenue,
  ChainTopPoolRevenue,
} from "@CM/Pages/Platform/Revenue/Models/Revenue";

const HISTORICAL_POOL_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/historical/toppools/20";

const CHAIN_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/chains";

export default class RevenueService extends ServiceBase {
  public async getBreakdownV1(signal?: AbortSignal): Promise<PoolRevenue[]> {
    return this.fetch<{
      revenue: PoolRevenue[];
    }>(HISTORICAL_POOL_ENDPOINT, undefined, signal).then(
      (resp) => resp.revenue
    );
  }

  public async getByChain(signal?: AbortSignal): Promise<ChainRevenue[]> {
    return this.fetch<{ revenue: ChainRevenue[] }>(
      CHAIN_REVENUE_ENDPOINT,
      undefined,
      signal
    ).then((resp) => resp.revenue);
  }

  public async getTopPools(
    chain: string,
    numPools = 10
  ): Promise<ChainTopPoolRevenue[]> {
    const endpoint = `https://api-py.llama.airforce/curve/v1/protocol/revenue/${chain}/toppools/${numPools}`;

    return this.fetch<{ revenue: ChainTopPoolRevenue[] }>(endpoint).then(
      (resp) => resp.revenue
    );
  }
}
