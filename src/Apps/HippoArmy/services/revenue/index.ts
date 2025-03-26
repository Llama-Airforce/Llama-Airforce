import { z } from "zod";
import { fetchJson as fetch, addQueryString } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { chain, pagination, timerange } from "../schema";
import * as Schema from "./schema";

const getDistributionsParams = z.object({
  ...chain,
  ...timerange,
  ...pagination,
});

export async function getDistributions(
  params: z.infer<typeof getDistributionsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain, ...validParams } = getDistributionsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/revenue/${chain}/distributions${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.distributionsResponse.parse(data);
}
