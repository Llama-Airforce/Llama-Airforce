import { Hono, type HonoResultOutput, cache } from "@/Framework/Hono";
import * as Api from "@HA/services/protocols";

const path = "/";

const app = new Hono().get(path, async (c) => {
  const data = await cache(c.req.url, async () => {
    const overview = await Api.getOverview({ chain: "ethereum" });

    const collateral = overview.protocols.reduce(
      (prev, protocol) => prev + protocol.totalUnderlying,
      0
    );

    const borrowed = overview.protocols.reduce(
      (prev, protocol) => prev + protocol.totalDebt,
      0
    );

    return {
      collateral,
      borrowed,
    };
  });

  return c.json(data);
});

export type Result = HonoResultOutput<typeof app, typeof path>;
export default app;
