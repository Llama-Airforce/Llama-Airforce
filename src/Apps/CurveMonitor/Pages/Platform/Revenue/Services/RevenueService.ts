import ServiceBase from "@/Services/ServiceBase";

const BREAKDOWN_V2_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/historical/breakdown?from=1686750777";

const CHAIN_REVENUE_ENDPOINT =
  "https://api-py.llama.airforce/curve/v1/protocol/revenue/chains";

export type BreakdownRevenue = {
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
  public async getBreakdown(signal?: AbortSignal): Promise<BreakdownRevenue[]> {
    return this.fetch<{
      revenue: BreakdownRevenue[];
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
