import { CosmosClient, type ItemDefinition } from "@azure/cosmos";
import type { RuntimeConfig } from "@LAF/nitro.config";

/**
 * Utility function for interacting with Azure Cosmos DB.
 *
 * @param containerId - The ID of the container to interact with.
 * @returns An object with methods for database operations.
 *
 * @example
 * const { getItem } = useCosmosDb('MyContainer');
 * const item = await getItem<MyType>('itemId');
 */
export const useCosmosDb = (containerId: string) => {
  const { dbEndpoint, dbKey } = useRuntimeConfig<RuntimeConfig>();

  // Function to make client a const yet have a try/catch.
  const client = (() => {
    try {
      return new CosmosClient({ endpoint: dbEndpoint, key: dbKey });
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Error creating Cosmos client",
      });
    }
  })();

  /**
   * Retrieves an item from the specified container.
   * @template T - Type of the item, must extend ItemDefinition.
   * @param {string} id - The ID of the item to retrieve.
   * @returns {Promise<T>} The retrieved item.
   * @throws {H3Error} If item not found or database error occurs.
   */
  const getItem = async <T extends ItemDefinition>(id: string) => {
    try {
      const { database } = await client.databases.createIfNotExists({
        id: "LlamaAirforce",
      });

      const { container } = await database.containers.createIfNotExists({
        id: containerId,
        partitionKey: "/id",
      });

      const { resource: item } = await container.item(id, id).read<T>();

      if (!item) {
        throw createError({
          statusCode: 404,
          message: `Item '${id}' not found`,
        });
      }

      return item;
    } catch (error) {
      console.error("Error fetching data from database:", error);

      throw createError({
        statusCode: 500,
        message: "Error fetching data from database",
      });
    }
  };

  return { getItem };
};
