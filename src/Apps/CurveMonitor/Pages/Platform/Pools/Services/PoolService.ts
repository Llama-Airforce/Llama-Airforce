import { paginate } from "@/Util";
import ServiceBase from "@/Services/ServiceBase";
import type { Pool } from "@CM/Pages/Platform/Pools/Models";

const THEGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/convex-community/volume-mainnet";

type PoolGraph = {
  id: string;
  name: string;
  symbol: string;
  cumulativeVolumeUSD: string;
  coins: string[];
};

export class PoolResponse {
  data: {
    pools: PoolGraph[];
  };
}

export default class PoolService extends ServiceBase {
  public async get(): Promise<Pool[]> {
    const fs = (page: number, offset: number) => {
      const query = `{
        pools(
          where: {
            cumulativeVolumeUSD_gte: 10000
          }
          first: ${offset}
          skip: ${page * offset})
        {
          id
          name
          symbol
          cumulativeVolumeUSD
          coins
        }
      }`;

      return this.fetch(THEGRAPH_URL, PoolResponse, { query }).then((resp) =>
        resp.data.pools.map((pool) => {
          return {
            id: pool.id,
            name: pool.name,
            symbol: pool.symbol,
            cumulateVolumeUsd: parseFloat(pool.cumulativeVolumeUSD),
            coins: pool.coins,
          };
        })
      );
    };

    return paginate(fs);
  }
}
