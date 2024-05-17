import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models/Chain";
import type * as ApiTypes from "@CM/Services/Chains/ApiTypes";
import * as Parsers from "@CM/Services/Chains/Parsers";

const API_URL = "https://prices.curve.fi";

export default class ChainsService extends ServiceBase {
  public async getChainInfo(chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetChainInfoResponse>(
      `${API_URL}/v1/chains/${chain}?page=1&per_page=1`
    );

    return Parsers.parseChainInfo(resp);
  }
}
