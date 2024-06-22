import { type Address } from "viem";
import { ServiceBaseHost } from "@/Services";
import type * as ApiTypes from "@LAF/Pages/Pirex/Services/ApiTypes";
import * as Parsers from "@LAF/Pages/Pirex/Services/Parsers";

export const API_URL = "https://api-next.llama.airforce";

export default class PirexService extends ServiceBaseHost {
  // eslint-disable-next-line max-lines-per-function
  public async getRewards(address: Address) {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetRewardsResponse>(
      `${host}/pirex/rewards/${address}`
    );

    return resp.snapshotRewards.flat().flatMap((x) => Parsers.parseRewards(x));
  }
}
