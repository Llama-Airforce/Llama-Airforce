import ServiceBase from "@/Services/ServiceBase";
import type { Reserves, Pool } from "@CM/Pages/Platform/Pools/Models";

const THEGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/convex-community/volume-mainnet";

type PoolReserves = {
  timestamp: string;
  reservesUSD: string[];
};

export class PoolReservesResponse {
  data: {
    dailyPoolSnapshots: PoolReserves[];
  };
}

export default class ReservesService extends ServiceBase {
  public async get(pool: Pool): Promise<Reserves[]> {
    const query = `{
        dailyPoolSnapshots(
          where: {
            pool: "${pool.id}"
          }
          first: 1000
          orderBy: timestamp
          orderDirection: desc
        )
        {
          timestamp
          reservesUSD
        }
      }`;

    return this.fetch(THEGRAPH_URL, PoolReservesResponse, { query }).then(
      (resp) =>
        resp.data.dailyPoolSnapshots.map((snapshot) => {
          return {
            timestamp: parseInt(snapshot.timestamp, 10),
            reservesUSD: snapshot.reservesUSD.map((x) => parseFloat(x)),
          };
        })
    );
  }
}
