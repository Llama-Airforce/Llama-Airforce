import {
  type Container,
  type ItemDefinition,
  type SqlQuerySpec,
  type Database,
  type Resource,
  CosmosClient,
} from "@azure/cosmos";
import type { RuntimeConfig } from "@LAF/nitro.config";

/** Cached database instance. */
let database: Database | null = null;

/**
 * Retrieves or initializes the Cosmos DB database.
 * @returns {Promise<Database>} The database instance.
 * @throws {H3Error} If there's an error initializing the database.
 */
async function getDatabase(): Promise<Database> {
  if (database) {
    return database;
  }

  try {
    const { dbEndpoint, dbKey } = useRuntimeConfig<RuntimeConfig>();
    const client = new CosmosClient({ endpoint: dbEndpoint, key: dbKey });
    const { database: db } = await client.databases.createIfNotExists({
      id: "LlamaAirforce",
    });

    database = db;

    return db;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error initializing Cosmos database",
    });
  }
}

/** Cache of container instances. */
const containers: Record<string, Container | undefined> = {};

/**
 * Retrieves or creates a container in the Cosmos DB.
 * @param {string} containerId - The ID of the container to retrieve or create.
 * @returns {Promise<Container>} The container instance.
 * @throws {H3Error} If there's an error creating or retrieving the container.
 */
async function getContainer(containerId: string): Promise<Container> {
  if (containers[containerId]) {
    return containers[containerId];
  }

  try {
    const database = await getDatabase();
    const { container } = await database.containers.createIfNotExists({
      id: containerId,
      partitionKey: "/id",
    });

    containers[containerId] = container;

    return container;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Error creating Cosmos container ${containerId}`,
    });
  }
}

/**
 * Utility function for interacting with Azure Cosmos DB.
 *
 * @param containerId - The ID of the container to interact with.
 * @returns An object with methods for database operations.
 *
 * @example
 * const { getItem, queryItems } = useCosmosDb('MyContainer');
 * const item = await getItem<MyType>('itemId');
 * const items = await queryItems<MyType>('SELECT * FROM c');
 */
export const useCosmosDb = (containerId: string) => {
  /**
   * Retrieves an item from the specified container.
   * @template T - Type of the item, must extend ItemDefinition.
   * @param {string} id - The ID of the item to retrieve.
   * @returns {Promise<T>} The retrieved item.
   * @throws {H3Error} If item not found or database error occurs.
   */
  const getItem = async <T extends ItemDefinition>(id: string) => {
    try {
      const container = await getContainer(containerId);
      const { resource: item } = await container.item(id, id).read<T>();

      if (!item) {
        throw createError({
          statusCode: 404,
          message: `Item '${id}' not found`,
        });
      }

      return stripMetadata(item);
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Error fetching data from database",
      });
    }
  };

  /**
   * Queries items from the specified container.
   * @template T - Type of the items, must extend ItemDefinition.
   * @param {string | SqlQuerySpec} query - The SQL query or SqlQuerySpec to execute.
   * @returns {Promise<T[]>} An array of items matching the query.
   * @throws {H3Error} If a database error occurs during the query.
   */
  const queryItems = async <T extends ItemDefinition>(
    query: string | SqlQuerySpec
  ): Promise<T[]> => {
    try {
      const container = await getContainer(containerId);
      const { resources } = await container.items.query<T>(query).fetchAll();

      return resources;
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: "Error fetching data from database",
      });
    }
  };

  return { getItem, queryItems };
};

function stripMetadata<T extends Resource & { _attachments?: unknown }>(
  item: T
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _rid, _self, _etag, _attachments, _ts, ...strippedItem } = item;
  return strippedItem;
}
