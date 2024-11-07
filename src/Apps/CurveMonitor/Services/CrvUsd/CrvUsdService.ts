import { ServiceBase } from "@/Services";
import type { Chain } from "@/Framework/Chain";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://prices.curve.fi";

export default class CrvUsdService extends ServiceBase {
  public async getMarkets(chain: Chain, page: number) {
    const resp = await this.fetch<ApiTypes.GetMarketsResponse>(
      `${API_URL}/v1/crvusd/markets/${chain}?fetch_on_chain=true&page=${page}&per_page=10`
    );

    return resp.data.map(Parsers.parseMarket);
  }

  public async getSnapshots(chain: Chain, marketAddr: string) {
    const resp = await this.fetch<ApiTypes.GetSnapshotsResponse>(
      `${API_URL}/v1/crvusd/markets/${chain}/${marketAddr}/snapshots?fetch_on_chain=true&agg=day`
    );

    return resp.data.map(Parsers.parseSnapshot);
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

  public async getUserMarkets(userAddr: string, chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetUserMarketsResponse>(
      `${API_URL}/v1/crvusd/users/${chain}/${userAddr}?page=1&per_page=100`
    );

    return Parsers.parseUserMarkets(resp);
  }

  public async getUserMarketStats(
    userAddr: string,
    chain: Chain,
    marketController: string
  ) {
    const resp = await this.fetch<ApiTypes.GetUserMarketStatsResponse>(
      `${API_URL}/v1/crvusd/users/${chain}/${getAddress(userAddr)}/${getAddress(
        marketController
      )}/stats?page=1&per_page=100`
    );

    return Parsers.parseUserMarketStats(resp);
  }

  public async getUserMarketSnapshots(
    userAddr: string,
    chain: Chain,
    marketController: string
  ) {
    const resp = await this.fetch<ApiTypes.GetUserMarketSnapshotsResponse>(
      `${API_URL}/v1/crvusd/users/${chain}/${getAddress(userAddr)}/${getAddress(
        marketController
      )}/snapshots?page=1&per_page=100`
    );

    return Parsers.parseUserMarketSnapshots(resp);
  }

  public async getUserMarketCollateralEvents(
    userAddr: string,
    chain: Chain,
    marketController: string
  ) {
    const resp = await this.fetch<ApiTypes.GetUserCollateralEventsResponse>(
      `${API_URL}/v1/crvusd/collateral_events/${chain}/${marketController}/${userAddr}`
    );

    return Parsers.parseUserCollateralEvents(resp);
  }
}
