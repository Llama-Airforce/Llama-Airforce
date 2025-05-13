import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import type { GetPoolsWeeklyResponse } from "@curvefi/prices-api/revenue";

const path = "/";

const app = new Hono().get(path, async (c) => {
  const start = c.req.query("start") ?? "1704063600";

  const data = await cache(c.req.url, async () => {
    try {
      const res = await fetch(
        `https://prices.curve.finance/v1/dao/fees/pools/weekly?start=${start}`
      );
      const data = (await res.json()) as GetPoolsWeeklyResponse;

      return data;
    } catch (error) {
      console.error("Error fetching data from Coin Prices API:", error);

      throw new HTTPException(500, {
        message: "Error fetching data from Coin Prices API",
      });
    }
  });

  return c.json(data);
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
