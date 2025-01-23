import { getAddress } from "viem";
import { fetchType as fetch } from "@/Services";
import { getHost, type Options, type Chain } from "..";
import type * as Responses from "./responses";
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

  const resp = await fetch<Responses.GetOHLCResponse>(url);

  return resp.data.map(Parsers.parseOHLC);
}
