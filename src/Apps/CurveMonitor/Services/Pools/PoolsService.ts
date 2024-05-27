import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models/Chain";
import type * as ApiTypes from "@CM/Services/Pools/ApiTypes";
import * as Parsers from "@CM/Services/Pools/Parsers";

const API_URL = "https://prices.curve.fi";

export default class PoolService extends ServiceBase {
  public async getPools(chain: Chain, page: number) {
    const resp = await this.fetch<ApiTypes.GetPoolsResponse>(
      `${API_URL}/v1/chains/${chain}?page=${page}&per_page=20`
    );

    return {
      chain: resp.chain,
      totals: Parsers.parsePoolTotals(resp.total),
      pools: resp.data.map(Parsers.parsePool),
    };
  }

  public async getPool(chain: Chain, poolAddr: string) {
    const resp = await this.fetch<ApiTypes.GetPoolResponse>(
      `${API_URL}/v1/pools/${chain}/${poolAddr}`
    );

    return Parsers.parsePool(resp);
  }

  public async getVolume(chain: Chain, poolAddr: string) {
    const range = 120 * 60 * 1000;
    const end = Math.floor(new Date().getTime() / 1000);
    const start = Math.floor(end - range);

    const resp = await this.fetch<ApiTypes.GetVolumeResponse>(
      `${API_URL}/v1/volume/usd/${chain}/${poolAddr}?` +
        `interval=day&` +
        `start=${start}&` +
        `end=${end}`
    );

    return resp.data.map(Parsers.parseVolume);
  }
}
