import { Hono, type HonoResultOutput, cache } from "@/Framework/Hono";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

const path = "/:id";

const app = new Hono().get(path, async (c) => {
  const id = c.req.param("id");

  const data = await cache(c.req.url, async () => {
    const { getItem } = useCosmosDb("Dashboards");
    const item = await getItem(id);

    return { statusCode: 200, dashboard: item };
  });

  return c.json(data);
});

type ResultBase = HonoResultOutput<typeof app, typeof path>;
export type Result<T = unknown> = Omit<ResultBase, "dashboard"> & {
  dashboard?: T;
};
export default app;
