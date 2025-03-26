import { fetchJson as fetch } from "@/Utils/fetch";
import type { Result } from "@HA/server/routes/stats.get";
import { getHost, type Options } from "..";

export async function getStats(options?: Options) {
  const host = getHost(options);

  const data = await fetch<Result>(`${host}/stats`, undefined, options?.signal);

  return data;
}
