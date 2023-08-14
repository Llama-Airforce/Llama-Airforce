import ServiceBase from "@/Services/ServiceBase";

const BREAKDOWN_V1_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/historical/toppools/20";

const BREAKDOWN_V2_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/historical/breakdown?from=1686750777";

const CHAIN_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/chains";

export type BreakdownRevenueV1 = {
  timestamp: number;
  pool: string;
  revenue: number;
};

export type BreakdownRevenueV2 = {
  week: number;
  label: string;
  total_fees: number;
};

export type ChainRevenue = {
  chain: string;
  totalDailyFeesUSD: number;
};

export type ChainTopPoolRevenue = {
  name: string;
  totalDailyFeesUSD: number;
};

export default class RevenueService extends ServiceBase {
  public async getBreakdownV1(
    signal?: AbortSignal
  ): Promise<BreakdownRevenueV1[]> {
    return this.fetch<{
      revenue: BreakdownRevenueV1[];
    }>(BREAKDOWN_V1_ENDPOINT, undefined, signal).then((resp) => resp.revenue);
  }

  public async getBreakdownV2(
    signal?: AbortSignal
  ): Promise<BreakdownRevenueV2[]> {
    return this.fetch<{
      revenue: BreakdownRevenueV2[];
    }>(BREAKDOWN_V2_ENDPOINT, undefined, signal).then((resp) => resp.revenue);
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
