import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models";
import type * as ApiTypes from "@CM/Services/LlamaLend/ApiTypes";
import * as Parsers from "@CM/Services/LlamaLend/Parsers";

const API_URL = "https://prices.curve.fi";

export default class LlamaLendService extends ServiceBase {
  public async getChains(): Promise<Chain[]> {
    return this.fetch<ApiTypes.GetChainsResponse>(
      `${API_URL}/v1/lending/chains`
    ).then((resp) => resp.data);
  }

  public async getMarkets(chain: Chain) {
    const resp = await this.fetch<ApiTypes.GetMarketsResponse>(
      `${API_URL}/v1/lending/markets/${chain}?fetch_on_chain=true&page=1&per_page=100`
    );

    return resp.data.map(Parsers.parseMarket);
  }

  public async getSnapshots(chain: Chain, marketController: string) {
    const resp = await this.fetch<ApiTypes.GetSnapshotsResponse>(
      `${API_URL}/v1/lending/markets/${chain}/${marketController}/snapshots?fetch_on_chain=true&agg=day`
    );

    return resp.data.map(Parsers.parseSnapshot);
  }
}
