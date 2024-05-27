import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models/Chain";
import type * as ApiTypes from "@CM/Services/CrvUsd/ApiTypes";
import type * as Models from "@CM/Services/CrvUsd/Models";
import * as Parsers from "@CM/Services/CrvUsd/Parsers";

const API_URL_OLD = "https://api-py.llama.airforce/curve";
const API_URL = "https://prices.curve.fi";

export default class CrvUsdService extends ServiceBase {
  public async getMarkets(chain: Chain, page: number) {
    const resp = await this.fetch<ApiTypes.GetMarketsResponse>(
      `${API_URL}/v1/crvusd/markets/${chain}?fetch_on_chain=false&page=${page}&per_page=10`
    );

    return resp.data.map(Parsers.parseMarket);
  }

  public async getSnapshots(chain: Chain, marketAddr: string) {
    const resp = await this.fetch<ApiTypes.GetSnapshotsResponse>(
      `${API_URL}/v1/crvusd/markets/${chain}/${marketAddr}/snapshots?fetch_on_chain=false&agg=day`
    );

    return resp.data.map(Parsers.parseSnapshot);
  }

  public async getPoolStats() {
    return this.fetch<{ stats: Models.PoolStats[] }>(
      `${API_URL_OLD}/v1/crvusd/pools/stats`
    ).then((resp) => resp.stats);
  }

  public async getCrvUsdPriceHistogram() {
    return this.fetch<Models.PriceHistogram>(
      `${API_URL_OLD}/v1/crvusd/prices/hist`
    );
  }

  public async getCrvUsdSupply(chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetSupplyResponse>(
      `${API_URL}/v1/crvusd/markets/${chain}/supply`
    );

    return resp.data.map(Parsers.parseSupply);
  }

  public async getKeepers(chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetKeepersResponse>(
      `${API_URL}/v1/crvusd/pegkeepers/${chain}`
    );

    return resp.keepers.map(Parsers.parseKeeper);
  }

  public async getFeesBreakdown() {
    return this.fetch<{
      pending: Models.FeesBreakdown[];
      collected: Models.FeesBreakdown[];
    }>(`${API_URL_OLD}/v1/crvusd/fees/breakdown`);
  }

  public async getYield() {
    return this.fetch<{ yields: Models.Yield[] }>(
      `${API_URL_OLD}/v1/crvusd/yield`
    ).then((resp) => resp.yields);
  }
}
