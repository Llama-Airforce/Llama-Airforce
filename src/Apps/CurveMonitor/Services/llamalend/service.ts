import { ServiceBase } from "@/Services";
import type { Chain } from "@/Types/Chain";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

const API_URL = "https://prices.curve.fi";

export default class LlamaLendService extends ServiceBase {
  public async getChains(): Promise<Chain[]> {
    return this.fetch<ApiTypes.GetChainsResponse>(
      `${API_URL}/v1/lending/chains`
    ).then((resp) => resp.data);
  }

  public async getMarkets(chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetMarketsResponse>(
      `${API_URL}/v1/lending/markets/${chain}?fetch_on_chain=true&page=1&per_page=100`
    );

    return resp.data.map(Parsers.parseMarket);
  }

  public async getSnapshots(chain: Chain, marketController: string) {
    const resp = await this.fetch<ApiTypes.GetSnapshotsResponse>(
      `${API_URL}/v1/lending/markets/${chain}/${marketController}/snapshots?fetch_on_chain=true&agg=day`
    );

    return resp.data.map(Parsers.parseSnapshot);
  }

  public async getUserMarkets(userAddr: string, chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetUserMarketsResponse>(
      `${API_URL}/v1/lending/users/${chain}/${userAddr}?page=1&per_page=100`
    );

    return Parsers.parseUserMarkets(resp);
  }

  public async getUserMarketStats(
    userAddr: string,
    chain: Chain,
    marketController: string
  ) {
    const resp = await this.fetch<ApiTypes.GetUserMarketStatsResponse>(
      `${API_URL}/v1/lending/users/${chain}/${getAddress(
        userAddr
      )}/${getAddress(marketController)}/stats?page=1&per_page=100`
    );

    return Parsers.parseUserMarketStats(resp);
  }

  public async getUserMarketSnapshots(
    userAddr: string,
    chain: Chain,
    marketController: string
  ) {
    const resp = await this.fetch<ApiTypes.GetUserMarketSnapshotsResponse>(
      `${API_URL}/v1/lending/users/${chain}/${getAddress(
        userAddr
      )}/${getAddress(marketController)}/snapshots?page=1&per_page=100`
    );

    return Parsers.parseUserMarketSnapshots(resp);
  }

  public async getUserMarketCollateralEvents(
    userAddr: string,
    chain: Chain,
    marketController: string
  ) {
    const resp = await this.fetch<ApiTypes.GetUserCollateralEventsResponse>(
      `${API_URL}/v1/lending/collateral_events/${chain}/${marketController}/${userAddr}`
    );

    return Parsers.parseUserCollateralEvents(resp);
  }
}
