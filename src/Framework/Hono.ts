import { Hono } from "hono";
import type { Env, Schema } from "hono";
import type { JSONObject, JSONArray } from "hono/utils/types";
import { HTTPException } from "hono/http-exception";
import { LRUCache } from "lru-cache";

// Re-exports for better importing experience in handlers.
export { Hono, HTTPException };

/**
 * Extracts the output type of a GET endpoint from a Hono app.
 * @template T - The Hono app type
 * @template Path - The endpoint path as a string literal
 * @returns The output type of the GET endpoint, or an error message if the endpoint doesn't exist
 */
export type HonoResultOutput<
  T extends Hono<Env, Schema, "/">,
  Path extends string
> = T extends Hono<Env, infer P, "/">
  ? Path extends keyof P
    ? P[Path] extends
        | { $get: { output: infer O } }
        | { $post: { output: infer O } }
      ? O
      : never
    : `Error: Endpoint "${Path}" does not exist`
  : never;

/** Our global cache. */
const cacheLRU = new LRUCache<string, object>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes default
  allowStale: true,
  noDeleteOnStaleGet: true,
});

/** Map that keeps track of cache keys that are in the middle of being updated. */
const cacheUpdates = new Map<string, Promise<unknown>>();

type WithCacheOptions = Parameters<typeof cacheLRU.set>["2"];

/**
 * Caches API responses with background revalidation
 * @param key Unique cache key
 * @param handler Function to fetch data on cache miss
 * @param options LRUCache set options
 * @returns Cached or newly fetched data
 * @note Returns stale data immediately if available, then revalidates in the background
 * @note Multiple simultaneous calls may result in redundant cache updates
 */
export async function cache<T extends JSONObject | JSONArray>(
  key: string,
  handler: () => Promise<T>,
  options: WithCacheOptions = {}
) {
  const cachedData = cacheLRU.get(key) as T | undefined;

  if (cachedData) {
    // Update cache if TTL expired, except if already being updated.
    if (cacheLRU.getRemainingTTL(key) <= 0) {
      if (!cacheUpdates.has(key)) {
        const updater = handler()
          .then((data) => {
            cacheLRU.set(key, data, options);
            cacheUpdates.delete(key);

            return data;
          })
          .catch(() => {
            console.error(`Failed to update ${key}, cleared updater cache`);
            cacheUpdates.delete(key);
          });

        cacheUpdates.set(key, updater);
      }
    }

    return cachedData;
  }

  const data = await handler();
  cacheLRU.set(key, data, options);

  return data;
}

/**
 * Deletes an item from the cache by its key
 * @param key The key of the item to delete
 * @returns true if the item was found and deleted, false otherwise
 */
export function cacheDelete(key: string): boolean {
  return cacheLRU.delete(key);
}

export function createEnvHelpers<T extends Record<string, string>>(keys: T) {
  /**
   * Retrieves environment variables based on the provided keys.
   * @returns An object with the environment variables.
   */
  function env(): { [K in keyof T]: string } {
    return Object.fromEntries(
      Object.entries(keys).map(([key, envVar]) => [key, process.env[envVar]])
    ) as { [K in keyof T]: string };
  }

  /**
   * Checks if all expected environment variables are set.
   * @throws Error if any environment variable is not set.
   */
  function check() {
    console.log("Checking if all expected env vars are set");

    Object.values(keys).forEach((variable) => {
      if (!process.env[variable]) {
        throw new Error(`${variable} not set in .env file`);
      }
    });

    console.log("All env vars gud");
  }

  return { env, check };
}
