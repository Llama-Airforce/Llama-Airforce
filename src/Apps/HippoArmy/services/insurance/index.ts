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
