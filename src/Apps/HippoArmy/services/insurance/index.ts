import { z } from "zod";
import { fetchJson as fetch, addQueryString } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { chain, pagination, timerange } from "../schema";
import * as Schema from "./schema";

const getEventsParams = z.object({
  ...chain,
  ...timerange,
  ...pagination,
});

export async function getEvents(
  params: z.infer<typeof getEventsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain, ...validParams } = getEventsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/insurance/${chain}/events${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.eventsResponse.parse(data);
}

const getCooldownQueueParams = z.object(chain);

export async function getCooldownQueue(
  params: z.infer<typeof getCooldownQueueParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getCooldownQueueParams.parse(params);

  const data = await fetch(
    `${host}/v1/insurance/${chain}/cooldown_queue`,
    undefined,
    options?.signal
  );

  return Schema.cooldownQueueResponse.parse(data);
}

const getAprHistoryParams = z.object({
  ...chain,
  ...timerange,
  ...pagination,
});

export async function getAprHistory(
  params: z.infer<typeof getAprHistoryParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain, ...validParams } = getAprHistoryParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/insurance/${chain}/apr_history${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.aprHistoryResponse.parse(data);
}

const getTvlHistoryParams = z.object({
  ...chain,
  ...timerange,
  ...pagination,
});

export async function getTvlHistory(
  params: z.infer<typeof getTvlHistoryParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain, ...validParams } = getTvlHistoryParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/insurance/${chain}/tvl_history${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.tvlHistoryResponse.parse(data);
}

const getTopUsersParams = z.object(chain);

export async function getTopUsers(
  params: z.infer<typeof getTopUsersParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getTopUsersParams.parse(params);

  const data = await fetch(
    `${host}/v1/insurance/${chain}/top_users`,
    undefined,
    options?.signal
  );

  return Schema.topUsersResponse.parse(data);
}

const getPositionHistParams = z.object({
  ...chain,
  bin_count: z.number().int().positive().optional(),
});

export async function getPositionHist(
  params: z.infer<typeof getPositionHistParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain, ...validParams } = getPositionHistParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/insurance/${chain}/position_histogram${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.positionHistogramResponse.parse(data);
}

const getDistributionHistoryParams = z.object({
  ...chain,
  ...timerange,
  ...pagination,
});

export async function getDistributionHistory(
  params: z.infer<typeof getDistributionHistoryParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain, ...validParams } = getDistributionHistoryParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/insurance/${chain}/insurance_pool_distribution_history${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.distributionHistoryResponse.parse(data);
}
