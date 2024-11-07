import { getAddress } from "viem";
import { ServiceBase } from "@/Services";
import type { Chain } from "@/Framework/Chain";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://prices.curve.fi";

export default class OHLService extends ServiceBase {
  public async getOHLC(
    chain: Chain,
    poolAddr: string,
    tokenMain: string,
    tokenRef: string
  ) {
    const range = 120 * 60 * 1000;
    const end = Math.floor(new Date().getTime() / 1000);
    const start = Math.floor(end - range);

    const url =
      `${API_URL}/v1/ohlc` +
      `/${chain}` +
      `/${getAddress(poolAddr)}?` +
      `main_token=${getAddress(tokenMain)}&` +
      `reference_token=${getAddress(tokenRef)}&` +
      `agg_number=1&` +
      `agg_units=day&` +
      `start=${start}&` +
      `end=${end}`;

    const resp = await this.fetch<ApiTypes.GetOHLCResponse>(url);

    return resp.data.map(Parsers.parseOHLC);
  }
}
