import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import type * as Responses from "@CM/Services/revenue/responses";

const path = "/";

const app = new Hono().get(path, async (c) => {
  const data = await cache(c.req.url, async () => {
    try {
      const res = await fetch(
        "https://prices.curve.fi/v1/dao/fees/crvusd/weekly?start=1704063600"
      );
      const data = (await res.json()) as Responses.GetCrvUsdWeeklyResponse;

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
