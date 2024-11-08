import { ServiceBase } from "@/Services";
import type { Chain } from "@/Types/Chain";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://prices.curve.fi";

export default class ChainsService extends ServiceBase {
  public async getSupportedChains() {
    const resp = await this.fetch<ApiTypes.GetSupportedChainsResponse>(
      `${API_URL}/v1/chains/`
    );

    return Parsers.parseSupportedChains(resp);
  }

  public async getChainInfo(chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetChainInfoResponse>(
      `${API_URL}/v1/chains/${chain}?page=1&per_page=1`
    );

    return Parsers.parseChainInfo(resp);
  }

  public async getTxs() {
    const resp = await this.fetch<ApiTypes.GetTransactionsResponse>(
      `${API_URL}/v1/chains/activity/transactions`
    );

    return Parsers.parseTxs(resp);
  }

  public async getUsers() {
    const resp = await this.fetch<ApiTypes.GetUsersResponse>(
      `${API_URL}/v1/chains/activity/users`
    );

    return Parsers.parseUsers(resp);
  }
}
