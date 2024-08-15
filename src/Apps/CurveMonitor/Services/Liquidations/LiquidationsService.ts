import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models";
import type * as ApiTypes from "@CM/Services/Liquidations/ApiTypes";
import * as Parsers from "@CM/Services/Liquidations/Parsers";

const API_URL = "https://prices.curve.fi";

export type Endpoint = "crvusd" | "lending";

export default class LiquidationsService extends ServiceBase {
  public async getSoftLiqRatios(
    endpoint: Endpoint,
    chain: Chain,
    marketAddr: string
  ) {
    const resp = await this.fetch<ApiTypes.GetSoftLiqRatiosResponse>(
      `${API_URL}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/soft_liquidation_ratio`
    );

    return resp.data.map(Parsers.parseSoftLiqRatio);
  }

  public async getLiqsDetailed(
    endpoint: Endpoint,
    chain: Chain,
    marketAddr: string
  ) {
    const resp = await this.fetch<ApiTypes.GetLiqsDetailedResponse>(
      `${API_URL}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/history/detailed`
    );

    return resp.data.map(Parsers.parseLiqsDetailed);
  }

  public async getLiqsAggregate(
    endpoint: Endpoint,
    chain: Chain,
    marketAddr: string
  ) {
    const resp = await this.fetch<ApiTypes.GetLiqsAggregateResponse>(
      `${API_URL}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/history/aggregated`
    );

    return resp.data.map(Parsers.parseLiqsAggregate);
  }

  public async getLiqOverview(
    endpoint: Endpoint,
    chain: Chain,
    marketAddr: string
  ) {
    const resp = await this.fetch<ApiTypes.GetLiqOverviewResponse>(
      `${API_URL}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/overview?fetch_on_chain=true`
    );

    return Parsers.parseLiqOverview(resp);
  }

  public async getLiqLosses(
    endpoint: Endpoint,
    chain: Chain,
    marketAddr: string
  ) {
    const resp = await this.fetch<ApiTypes.GetLiqLossesResponse>(
      `${API_URL}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/losses/history`
    );

    return resp.data.map(Parsers.parseLiqLosses);
  }

  public async getLiqHealthDeciles(
    endpoint: Endpoint,
    chain: Chain,
    marketAddr: string
  ) {
    const resp = await this.fetch<ApiTypes.GetLiqHealthDecilesResponse>(
      `${API_URL}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/health/distribution`
    );

    return resp.data.map(Parsers.parseLiqHealthDeciles);
  }
}
