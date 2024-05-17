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

  public async getLlammaOHLC(chain: Chain, marketAddr: string) {
    const resp = await this.fetch<ApiTypes.GetLlammaOHLCResponse>(
      `${API_URL}/v1/crvusd/llamma_ohlc/${chain}/${marketAddr}?agg_number=1&agg_units=hour&start=1714561943&end=1715339543`
    );

    return resp.data.map(Parsers.parseLlammaOHLC);
  }

  public async getMarketUserStates(
    marketAddr: string,
    offset: number,
    limit: number
  ) {
    return this.fetch<{ states: Models.MarketState[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/users/states?offset=${offset}&limit=${limit}`
    ).then((resp) => resp.states);
  }

  public async getPoolStats() {
    return this.fetch<{ stats: Models.PoolStats[] }>(
      `${API_URL_OLD}/v1/crvusd/pools/stats`
    ).then((resp) => resp.stats);
  }

  public async getPoolPrices() {
    return this.fetch<{ prices: Models.PoolPrice[] }>(
      `${API_URL_OLD}/v1/crvusd/prices`
    ).then((resp) => resp.prices);
  }

  public async getCrvUsdPriceHistogram() {
    return this.fetch<Models.PriceHistogram>(
      `${API_URL_OLD}/v1/crvusd/prices/hist`
    );
  }

  public async getCrvUsdSupply() {
    return this.fetch<{ supply: Models.CrvUsdSupply[] }>(
      `${API_URL_OLD}/v1/crvusd/supply`
    ).then((resp) => resp.supply);
  }

  public async getVolume(marketAddr: string) {
    return this.fetch<{ volumes: Models.MarketVolume[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/volume`
    ).then((resp) => resp.volumes);
  }

  public async getFees() {
    return this.fetch<{ fees: Models.Fees }>(
      `${API_URL_OLD}/v1/crvusd/fees`
    ).then((resp) => resp.fees);
  }

  public async getFeesBreakdown() {
    return this.fetch<{
      pending: Models.FeesBreakdown[];
      collected: Models.FeesBreakdown[];
    }>(`${API_URL_OLD}/v1/crvusd/fees/breakdown`);
  }

  public async getKeepers(chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetKeepersResponse>(
      `${API_URL}/v1/crvusd/pegkeepers/${chain}`
    );

    return resp.keepers.map(Parsers.parseKeeper);
  }

  public async getYield() {
    return this.fetch<{ yields: Models.Yield[] }>(
      `${API_URL_OLD}/v1/crvusd/yield`
    ).then((resp) => resp.yields);
  }

  public async getHistoricalSoftLiquidations(marketAddr: string) {
    return this.fetch<{ losses: Models.HistoricalSoftLiquidations[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/losses/historical/soft`
    ).then((resp) => resp.losses);
  }

  public async getHistoricalMedianLoss(marketAddr: string) {
    return this.fetch<{ losses: Models.HistoricalMedianLoss[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/losses/historical/median`
    ).then((resp) => resp.losses);
  }

  public async getHistoricalAverageHealth(marketAddr: string) {
    return this.fetch<{ health: Models.HistoricalAverageHealth[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/health/historical`
    ).then((resp) => resp.health);
  }

  public async getHealthDeciles(marketAddr: string) {
    return this.fetch<{ health: Models.HealthDecile[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/health`
    ).then((resp) => resp.health);
  }

  public async getProportionLosers(marketAddr: string) {
    return this.fetch<{ losses: Models.HistoricalLosers[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/losses/historical/proportions`
    ).then((resp) => resp.losses);
  }

  public async getHistoricalLiquidations(marketAddr: string) {
    return this.fetch<{ liquidations: Models.HistoricalLiquidations[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/historical`
    ).then((resp) => resp.liquidations);
  }

  public async getTopLiquidators(marketAddr: string) {
    return this.fetch<{ liquidations: Models.Liquidators[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/liquidators`
    ).then((resp) => resp.liquidations);
  }

  public async getMarketStateHealth(marketAddr: string) {
    return this.fetch<{ health: Models.MarketHealthState }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/state`
    ).then((resp) => resp.health);
  }

  public async getMarketAvailableCap(marketAddr: string) {
    return this.fetch<{ available: Models.AvailableCap[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/available`
    ).then((resp) => resp.available);
  }

  public async getLiquidatorRevenue(marketAddr: string) {
    return this.fetch<{ revenue: Models.LiquidatorRevenue[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/liquidations/liquidators/revenue`
    ).then((resp) => resp.revenue);
  }

  public async getHistoricalCollateralRatio(marketAddr: string) {
    return this.fetch<{ ratios: Models.CollateralRatios[] }>(
      `${API_URL_OLD}/v1/crvusd/markets/${marketAddr}/collateral_ratio`
    ).then((resp) => resp.ratios);
  }
}