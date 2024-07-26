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
    ? P[Path] extends { $get: { output: infer O } }
      ? O
      : never
    : `Error: Endpoint "${Path}" does not exist`
  : never;

const cacheLRU = new LRUCache<string, object>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes default
  allowStale: true,
  noDeleteOnStaleGet: true,
});

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
    if (cacheLRU.getRemainingTTL(key) <= 0) {
      void handler().then((data) => cacheLRU.set(key, data, options));
    }
    return cachedData;
  }

  const data = await handler();
  cacheLRU.set(key, data, options);

  return data;
}
