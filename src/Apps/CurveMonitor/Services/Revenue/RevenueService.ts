import { ServiceBaseHost } from "@/Services";
import { paginate } from "@/Utils/Pagination";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL_OLD = "https://api-py.llama.airforce/curve/v1";
const API_URL = "https://prices.curve.fi";

export default class RevenueService extends ServiceBaseHost {
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

  public async getCrvUsdWeekly() {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetCrvUsdWeeklyResponse>(
      `${host}/revenue/crvusdweekly`
    );

    return resp.fees.map(Parsers.parseCrvUsdWeekly);
  }

  public async getPoolsWeekly() {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetPoolsWeeklyResponse>(
      `${host}/revenue/pools`
    );

    return resp.fees.map(Parsers.parsePoolsWeekly);
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

  public async getCowSwapSettlements(timestamp?: number) {
    const resp = await this.fetch<ApiTypes.GetCowSwapSettlementsResponse>(
      `${API_URL}/v1/dao/fees/settlements${
        timestamp ? "?timestamp=" + timestamp.toString() : ""
      }`
    );

    return resp.data.map(Parsers.parseCowSwapSettlement);
  }

  public async getFeesCollected() {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetFeesCollectedResponse>(
      `${host}/revenue/fees-collected`
    );

    return resp.data.map(Parsers.parseFeesCollected);
  }

  public async getFeesStaged() {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetFeesStagedResponse>(
      `${host}/revenue/fees-staged`
    );

    return resp.data.map(Parsers.parseFeesStaged);
  }
}
