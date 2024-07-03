import { type Overview } from "@LAF/Pages/Bribes/Models";
import { useCosmosDb } from "@LAF/Server/util/useCosmosDb";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    const { id } = getRouterParams(event);

    const { getItem } = useCosmosDb("Dashboards");
    const item = await getItem<Overview>(id);

    return {
      statusCode: 200,
      dashboard: item as Overview | undefined,
    };
  },
  { maxAge: 60 }
);

export default handler;
