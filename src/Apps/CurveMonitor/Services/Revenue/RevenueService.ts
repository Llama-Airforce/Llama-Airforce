import { ServiceBase } from "@/Services";
import { paginate } from "@/Util";
import type * as ApiTypes from "@CM/Services/Revenue/ApiTypes";
import * as Parsers from "@CM/Services/Revenue/Parsers";

const API_URL_OLD = "https://api-py.llama.airforce/curve/v1";
const API_URL = "https://prices.curve.fi";

export default class RevenueService extends ServiceBase {
  public async getBreakdown(signal?: AbortSignal) {
    const resp = await this.fetch<ApiTypes.GetBreakdownResponse>(
      `${API_URL_OLD}/protocol/revenue/historical/breakdown?from=1686750777`,
      undefined,
      signal
    );

    return resp.revenue.map(Parsers.parseBreakdown);
  }

  public async getByChain(signal?: AbortSignal) {
    const resp = await this.fetch<ApiTypes.GetByChainResponse>(
      `${API_URL_OLD}/protocol/revenue/chains`,
      undefined,
      signal
    );

    return resp.revenue.map(Parsers.parseChainRevenue);
  }

  public async getTopPools(chain: string, numPools = 10) {
    const chainStr = chain === "ethereum" ? "mainnet" : chain;

    const resp = await this.fetch<ApiTypes.GetTopPoolsResponse>(
      `${API_URL_OLD}/protocol/revenue/${chainStr}/toppools/${numPools}`
    );

    return resp.revenue.map(Parsers.parseTopPools);
  }

  public async getCushions(chain: string) {
    const resp = await this.fetch<ApiTypes.GetCushionsResponse>(
      `${API_URL}/v1/dao/fees/${chain}/pending`
    );

    return resp.data.map(Parsers.parseCushion);
  }

  public async getDistributions() {
    const fs = (page: number) => {
      return this.fetch<ApiTypes.GetDistributionsResponse>(
        `${API_URL}/v1/dao/fees/distributions?page=${page}&per_page=100`
      ).then((resp) => resp.distributions.map(Parsers.parseDistribution));
    };

    const distributions = await paginate(fs, 1, 100);

    return distributions;
  }
}
