import { ServiceBase } from "@/Services";
import type * as ApiTypes from "@CM/Services/Revenue/ApiTypes";
import * as Parsers from "@CM/Services/Revenue/Parsers";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export default class RevenueService extends ServiceBase {
  public async getBreakdown(signal?: AbortSignal) {
    const resp = await this.fetch<ApiTypes.GetBreakdownResponse>(
      `${API_URL}/protocol/revenue/historical/breakdown?from=1686750777`,
      undefined,
      signal
    );

    return resp.revenue.map(Parsers.parseBreakdown);
  }

  public async getByChain(signal?: AbortSignal) {
    const resp = await this.fetch<ApiTypes.GetByChainResponse>(
      `${API_URL}/protocol/revenue/chains`,
      undefined,
      signal
    );

    return resp.revenue.map(Parsers.parseChainRevenue);
  }

  public async getTopPools(chain: string, numPools = 10) {
    const resp = await this.fetch<ApiTypes.GetTopPoolsResponse>(
      `${API_URL}/protocol/revenue/${chain}/toppools/${numPools}`
    );

    return resp.revenue.map(Parsers.parseTopPools);
  }

  public async getCushions() {
    const resp = await this.fetch<ApiTypes.GetCushionsResponse>(
      `${API_URL}/protocol/couch/cushions`
    );

    return resp.cushions.map(Parsers.parseCushion);
  }
}
