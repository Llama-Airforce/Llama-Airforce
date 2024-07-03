import { createError, getRouterParams } from "h3";
import { defineCachedEventHandler, useRuntimeConfig } from "nitropack/runtime";
import { CosmosClient } from "@azure/cosmos";
import type { RuntimeConfig } from "@LAF/nitro.config";
import { type Overview } from "@LAF/Pages/Bribes/Models";

export type Result = Awaited<ReturnType<typeof handler>>;

const handler = defineCachedEventHandler(
  async (event) => {
    const { id } = getRouterParams(event);
    const { dbEndpoint, dbKey } = useRuntimeConfig<RuntimeConfig>(event);

    try {
      const client = new CosmosClient({ endpoint: dbEndpoint, key: dbKey });
      const { database } = await client.databases.createIfNotExists({
        id: "LlamaAirforce",
      });
      const { container } = await database.containers.createIfNotExists({
        id: "Dashboards",
        partitionKey: "/id",
      });

      const { resource: item } = await container.item(id, id).read<Overview>();

      if (!item) {
        throw createError({
          statusCode: 404,
          message: `Dashboard with id ${id} not found`,
        });
      }

      return {
        statusCode: 200,
        dashboard: item as Overview | undefined,
      };
    } catch (error) {
      console.error("Error fetching data from database:", error);

      throw createError({
        statusCode: 500,
        message: "Error fetching data from database",
      });
    }
  },
  { maxAge: 60 }
);

export default handler;
