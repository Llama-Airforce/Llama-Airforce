import { fetchType as fetch } from "@/Services";
import { getHost, type Options } from "..";
import type { Chain } from "@/Types/Chain";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

export async function getPools(chain: Chain, options: Options = {}) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetPoolsResponse>(
    `${host}/chains/${chain}`
  );

  return {
    chain: resp.chain,
    totals: Parsers.parsePoolTotals(resp.total),
    pools: resp.data.map(Parsers.parsePool),
  };
}

export async function getPool(
  chain: Chain,
  poolAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);
  const resp = await fetch<ApiTypes.GetPoolResponse>(
    `${host}/v1/pools/${chain}/${poolAddr}`
  );

  return Parsers.parsePool(resp);
}

export async function getVolume(
  chain: Chain,
  poolAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);

  const range = 120 * 60 * 1000;
  const end = Math.floor(new Date().getTime() / 1000);
  const start = Math.floor(end - range);

  const resp = await fetch<ApiTypes.GetVolumeResponse>(
    `${host}/v1/volume/usd/${chain}/${poolAddr}?` +
      `interval=day&` +
      `start=${start}&` +
      `end=${end}`
  );

  return resp.data.map(Parsers.parseVolume);
}

export async function getTvl(
  chain: Chain,
  poolAddr: string,
  options: Options = {}
) {
  const host = await getHost(options);

  const range = 120 * 60 * 1000;
  const end = Math.floor(new Date().getTime() / 1000);
  const start = Math.floor(end - range);

  const resp = await fetch<ApiTypes.GetTvlResponse>(
    `${host}/v1/snapshots/${chain}/${poolAddr}/tvl?` +
      `interval=day&` +
      `start=${start}&` +
      `end=${end}`
  );

  return resp.data.map(Parsers.parseTvl);
}
