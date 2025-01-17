import { ServiceBaseHost } from "@/Services";
import type { Chain } from "@/Types/Chain";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://prices.curve.fi";

export default class PoolService extends ServiceBaseHost {
  public async getPools(chain: Chain) {
    const host = await this.getHost();

    const resp = await this.fetch<ApiTypes.GetPoolsResponse>(
      `${host}/chains/${chain}`
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

  public async getTvl(chain: Chain, poolAddr: string) {
    const range = 120 * 60 * 1000;
    const end = Math.floor(new Date().getTime() / 1000);
    const start = Math.floor(end - range);

    const resp = await this.fetch<ApiTypes.GetTvlResponse>(
      `${API_URL}/v1/snapshots/${chain}/${poolAddr}/tvl?` +
        `interval=day&` +
        `start=${start}&` +
        `end=${end}`
    );

    return resp.data.map(Parsers.parseTvl);
  }
}
