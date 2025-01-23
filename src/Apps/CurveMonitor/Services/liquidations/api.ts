import { fetchType as fetch } from "@/Services";
import type { Chain } from "@/Types/Chain";
import { getHost, type Options } from "..";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

export type Endpoint = "crvusd" | "lending";

export async function getSoftLiqRatios(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetSoftLiqRatiosResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/soft_liquidation_ratio`
  );

  return resp.data.map(Parsers.parseSoftLiqRatio);
}

export async function getLiqsDetailed(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLiqsDetailedResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/history/detailed`
  );

  return resp.data.map(Parsers.parseLiqsDetailed);
}

export async function getLiqsAggregate(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLiqsAggregateResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/history/aggregated`
  );

  return resp.data.map(Parsers.parseLiqsAggregate);
}

export async function getLiqOverview(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLiqOverviewResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/overview?fetch_on_chain=true`
  );

  return Parsers.parseLiqOverview(resp);
}

export async function getLiqLosses(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLiqLossesResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/losses/history`
  );

  return resp.data.map(Parsers.parseLiqLosses);
}

export async function getLiqHealthDeciles(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetLiqHealthDecilesResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/health/distribution`
  );

  return resp.data.map(Parsers.parseLiqHealthDeciles);
}
