import {
  Hono,
  HTTPException,
  type HonoResultOutput,
  cache,
} from "@/Framework/Hono";
import { isChain } from "@curvefi/prices-api";
import type { GetPoolsResponse } from "@curvefi/prices-api/pools";

const path = "/:chain";

const app = new Hono().get(path, async (c) => {
  const chain = c.req.param("chain");

  if (!isChain(chain)) {
    throw new HTTPException(400, { message: "Invalid chain" });
  }

  const data = await cache(c.req.url, async () => {
    try {
      const res = await fetch(
        `https://prices.curve.finance/v1/chains/${chain}?page=1&per_page=9999`
      );
      const data = (await res.json()) as GetPoolsResponse;

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
