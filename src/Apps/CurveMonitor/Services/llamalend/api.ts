import { fetchType as fetch } from "@/Services";
import type { Chain } from "@/Types/Chain";
import { getHost, type Options } from "..";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

export async function getChains(options: Options = {}): Promise<Chain[]> {
  const host = await getHost(options);

  return fetch<ApiTypes.GetChainsResponse>(`${host}/v1/lending/chains`).then(
    (resp) => resp.data
  );
}

export async function getMarkets(chain: Chain, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetMarketsResponse>(
    `${host}/v1/lending/markets/${chain}?fetch_on_chain=true&page=1&per_page=100`
  );

  return resp.data.map(Parsers.parseMarket);
}

export async function getSnapshots(
  chain: Chain,
  marketController: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetSnapshotsResponse>(
    `${host}/v1/lending/markets/${chain}/${marketController}/snapshots?fetch_on_chain=true&agg=day`
  );

  return resp.data.map(Parsers.parseSnapshot);
}

export async function getUserMarkets(
  userAddr: string,
  chain: Chain,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetUserMarketsResponse>(
    `${host}/v1/lending/users/${chain}/${userAddr}?page=1&per_page=100`
  );

  return Parsers.parseUserMarkets(resp);
}

export async function getUserMarketStats(
  userAddr: string,
  chain: Chain,
  marketController: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetUserMarketStatsResponse>(
    `${host}/v1/lending/users/${chain}/${getAddress(userAddr)}/${getAddress(
      marketController
    )}/stats?page=1&per_page=100`
  );

  return Parsers.parseUserMarketStats(resp);
}

export async function getUserMarketSnapshots(
  userAddr: string,
  chain: Chain,
  marketController: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetUserMarketSnapshotsResponse>(
    `${host}/v1/lending/users/${chain}/${getAddress(userAddr)}/${getAddress(
      marketController
    )}/snapshots?page=1&per_page=100`
  );

  return Parsers.parseUserMarketSnapshots(resp);
}

export async function getUserMarketCollateralEvents(
  userAddr: string,
  chain: Chain,
  marketController: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetUserCollateralEventsResponse>(
    `${host}/v1/lending/collateral_events/${chain}/${marketController}/${userAddr}`
  );

  return Parsers.parseUserCollateralEvents(resp);
}
