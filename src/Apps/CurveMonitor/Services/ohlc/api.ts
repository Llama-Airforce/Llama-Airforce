import { getAddress } from "viem";
import { fetchType as fetch } from "@/Services";
import type { Chain } from "@/Types/Chain";
import { getHost, type Options } from "..";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

export async function getOHLC(
  chain: Chain,
  poolAddr: string,
  tokenMain: string,
  tokenRef: string,
  options: Options = {}
) {
  const host = await getHost(options);

  const range = 120 * 60 * 1000;
  const end = Math.floor(new Date().getTime() / 1000);
  const start = Math.floor(end - range);

  const url =
    `${host}/v1/ohlc` +
    `/${chain}` +
    `/${getAddress(poolAddr)}?` +
    `main_token=${getAddress(tokenMain)}&` +
    `reference_token=${getAddress(tokenRef)}&` +
    `agg_number=1&` +
    `agg_units=day&` +
    `start=${start}&` +
    `end=${end}`;

  const resp = await fetch<ApiTypes.GetOHLCResponse>(url);

  return resp.data.map(Parsers.parseOHLC);
}
