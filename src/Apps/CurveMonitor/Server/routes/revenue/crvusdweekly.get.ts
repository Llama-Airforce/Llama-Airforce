import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import type * as ApiTypes from "@CM/Services/Revenue/ApiTypes";

const path = "/";

const app = new Hono().get(path, async (c) => {
  const data = await cache(c.req.url, async () => {
    try {
      const res = await fetch(
        "https://prices.curve.fi/v1/dao/fees/crvusd/weekly"
      );
      const data = (await res.json()) as ApiTypes.GetCrvUsdWeeklyResponse;

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
