import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  withCache,
} from "@/Framework/Hono";
import type * as ApiTypes from "@CM/Services/Revenue/ApiTypes";

const path = "/";

const app = new Hono().get(path, (c) =>
  withCache(c, async () => {
    try {
      const res = await fetch(
        "https://prices.curve.fi/v1/dao/fees/pools/weekly"
      );
      const data = (await res.json()) as ApiTypes.GetPoolsWeeklyResponse;

      return data;
    } catch (error) {
      console.error("Error fetching data from Coin Prices API:", error);

      throw new HTTPException(500, {
        message: "Error fetching data from Coin Prices API",
      });
    }
  })
);

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
