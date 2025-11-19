import { ServiceBaseHost } from "@/Services";
import type { Address } from "@/types/address";
import type * as ApiTypes from "@LAF/Pages/Pirex/Services/ApiTypes";
import * as Parsers from "@LAF/Pages/Pirex/Services/Parsers";

export default class PirexService extends ServiceBaseHost {
  public async getRedemptions(address: Address) {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetRedemptionsResponse>(
      `${host}/pirex/redemptions/${address}`
    );

    return resp.map((x) => Parsers.parseRedemption(x));
  }

  public async getFutures(address: Address) {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetFuturesResponse>(
      `${host}/pirex/futures/${address}`
    );

    return resp.map((x) => Parsers.parseFuture(x));
  }
}
