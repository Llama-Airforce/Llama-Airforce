import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

export type Result<T = unknown> = Awaited<ReturnType<typeof handler>> & {
  dashboard?: T;
};

const handler = defineCachedEventHandler(
  async (event) => {
    const { id } = getRouterParams(event);

    const { getItem } = useCosmosDb("Dashboards");
    const item = await getItem(id);

    return {
      statusCode: 200,
      dashboard: item,
    } as { statusCode: number; dashboard?: unknown };
  },
  { maxAge: 60 }
);

export default handler;
