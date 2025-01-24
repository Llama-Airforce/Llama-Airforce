import { getHost, type Options, type Chain } from "..";
import { fetchJson as fetch } from "../fetch";
import type * as Responses from "./responses";
import * as Parsers from "./parsers";

export type Endpoint = "crvusd" | "lending";

export async function getSoftLiqRatios(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options?: Options
) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetSoftLiqRatiosResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/soft_liquidation_ratio`
  );

  return resp.data.map(Parsers.parseSoftLiqRatio);
}

export async function getLiqsDetailed(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options?: Options
) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetLiqsDetailedResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/history/detailed`
  );

  return resp.data.map(Parsers.parseLiqsDetailed);
}

export async function getLiqsAggregate(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options?: Options
) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetLiqsAggregateResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/history/aggregated`
  );

  return resp.data.map(Parsers.parseLiqsAggregate);
}

export async function getLiqOverview(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options?: Options
) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetLiqOverviewResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/overview?fetch_on_chain=true`
  );

  return Parsers.parseLiqOverview(resp);
}

export async function getLiqLosses(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options?: Options
) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetLiqLossesResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/losses/history`
  );

  return resp.data.map(Parsers.parseLiqLosses);
}

export async function getLiqHealthDeciles(
  endpoint: Endpoint,
  chain: Chain,
  marketAddr: string,
  options?: Options
) {
  const host = await getHost(options);
  const resp = await fetch<Responses.GetLiqHealthDecilesResponse>(
    `${host}/v1/${endpoint}/liquidations/${chain}/${marketAddr}/health/distribution`
  );

  return resp.data.map(Parsers.parseLiqHealthDeciles);
}
