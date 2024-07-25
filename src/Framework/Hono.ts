import { Hono } from "hono";
import type { Env, Schema, Context } from "hono";
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

const cache = new LRUCache<string, object>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes default
  allowStale: true,
  noDeleteOnStaleGet: true,
});

/**
 * Middleware for caching API responses
 * @param c Hono context
 * @param handler Function to execute if cache miss, should return JSON-serializable data
 * @param options LRUCache set options
 * @returns JSON response, either from cache (potentially stale) or newly fetched
 * @note Returns stale data immediately if available, then revalidates in the background
 * @note Multiple simultaneous calls may result in redundant cache updates
 */
export async function withCache<T extends JSONObject | JSONArray>(
  c: Context,
  handler: () => Promise<T>,
  options: Parameters<typeof cache.set>["2"] = {}
) {
  const key = c.req.url;
  const cachedData = cache.get(key);

  if (cachedData) {
    // Return potentially stale data immediately, update cache in background if expired
    if (cache.getRemainingTTL(key) <= 0) {
      void handler().then((data) => cache.set(key, data, options));
    }
    return c.json(cachedData as T);
  }

  // Cache miss: fetch new data and store in cache
  const data = await handler();
  cache.set(key, data, options);

  return c.json(data);
}
