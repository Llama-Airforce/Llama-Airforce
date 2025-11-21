import { z } from "zod/v4";
import { fetchJson as fetch, addQueryString } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import * as Schema from "./schema";

const getStatsParams = z.object({ chain: z.string() });
export async function getStats(params: z.infer<typeof getStatsParams>, options?: Options) {
  const host = getHost(options);
  const { chain } = getStatsParams.parse(params);
  const data = await fetch(`${host}/v1/savings/${chain}/stats`, undefined, options?.signal);
  return Schema.statsResponse.parse(data);
}

const getAprHistoryParams = z.object({ chain: z.string(), start: z.number().optional(), end: z.number().optional(), page: z.number().optional(), per_page: z.number().optional() });
export async function getAprHistory(params: z.infer<typeof getAprHistoryParams>, options?: Options) {
  const host = getHost(options);
  const { chain, ...valid } = getAprHistoryParams.parse(params);
  const queryString = addQueryString(valid);
  const data = await fetch(`${host}/v1/savings/${chain}/apr/history${queryString}`, undefined, options?.signal);
  return Schema.aprHistoryResponse.parse(data);
}

const getTvlHistoryParams = z.object({ chain: z.string(), start: z.number().optional(), end: z.number().optional(), page: z.number().optional(), per_page: z.number().optional() });
export async function getTvlHistory(params: z.infer<typeof getTvlHistoryParams>, options?: Options) {
  const host = getHost(options);
  const { chain, ...valid } = getTvlHistoryParams.parse(params);
  const queryString = addQueryString(valid);
  const data = await fetch(`${host}/v1/savings/${chain}/tvl/history${queryString}`, undefined, options?.signal);
  return Schema.tvlHistoryResponse.parse(data);
}

const getVolumeHistoryParams = z.object({ chain: z.string(), start: z.number().optional(), end: z.number().optional(), page: z.number().optional(), per_page: z.number().optional() });
export async function getVolumeHistory(params: z.infer<typeof getVolumeHistoryParams>, options?: Options) {
  const host = getHost(options);
  const { chain, ...valid } = getVolumeHistoryParams.parse(params);
  const queryString = addQueryString(valid);
  const data = await fetch(`${host}/v1/savings/${chain}/volume/history${queryString}`, undefined, options?.signal);
  return Schema.volumeHistoryResponse.parse(data);
}

const getEventsParams = z.object({ chain: z.string(), page: z.number().int().positive().optional(), per_page: z.number().int().positive().optional() });
export async function getEvents(params: z.infer<typeof getEventsParams>, options?: Options) {
  const host = getHost(options);
  const { chain, ...validParams } = getEventsParams.parse(params);
  const queryString = addQueryString(validParams);
  const data = await fetch(`${host}/v1/savings/${chain}/events${queryString}`, undefined, options?.signal);
  return Schema.eventsResponse.parse(data);
}

const getTopUsersParams = z.object({ chain: z.string() });
export async function getTopUsers(params: z.infer<typeof getTopUsersParams>, options?: Options) {
  const host = getHost(options);
  const { chain } = getTopUsersParams.parse(params);
  const data = await fetch(`${host}/v1/savings/${chain}/top_users`, undefined, options?.signal);
  return Schema.topUsersResponse.parse(data);
}
