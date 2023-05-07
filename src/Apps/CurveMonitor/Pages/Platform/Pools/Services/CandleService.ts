import { paginate } from "@/Util";
import ServiceBase from "@/Services/ServiceBase";
import type { Candle, Pool } from "@CM/Pages/Platform/Pools/Models";

const THEGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/convex-community/volume-mainnet";

type CandleGraph = {
  timestamp: string;
  open: string;
  high: string;
  low: string;
  close: string;
  token0TotalAmount: string;
};

export class CandlesResponse {
  data: {
    candles: CandleGraph[];
  };
}

export default class CandleService extends ServiceBase {
  public async get(pool: Pool): Promise<Candle[]> {
    let timestampLast = 0;

    // Period 3600 = 1 hour.
    const fs = async (_page: number, offset: number) => {
      const query = `{
        candles(
          where: {
            pool: "${pool.id}"
            period: 3600
            timestamp_gte: ${timestampLast}
          }
          first: ${offset}
        ) {
          timestamp
          open
          close
          low
          high
          token0TotalAmount
        }
      }`;

      const resp = await this.fetch(THEGRAPH_URL, CandlesResponse, {
        query,
      }).then((candles) =>
        candles.data.candles.map((candle) => {
          return {
            timestamp: parseInt(candle.timestamp, 10),
            open: parseFloat(candle.open),
            high: parseFloat(candle.high),
            low: parseFloat(candle.low),
            close: parseFloat(candle.close),
            token0TotalAmount: parseFloat(candle.token0TotalAmount),
          };
        })
      );

      timestampLast = Math.max(...resp.map((c) => c.timestamp));

      return resp;
    };

    return paginate(fs);
  }
}
