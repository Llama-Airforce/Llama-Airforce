import { z } from "zod";
import { fetchJson as fetch, addQueryString } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { chain, pagination } from "../schema";
import * as Schema from "./schema";

const getOverviewParams = z.object(chain);

export async function getOverview(
  params: z.infer<typeof getOverviewParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getOverviewParams.parse(params);

  const data = await fetch(
    `${host}/v1/protocols/overview/${chain}`,
    undefined,
    options?.signal
  );

  return Schema.overviewResponse.parse(data);
}

const getPairsParams = z.object({
  ...chain,
  ...pagination,
  protocol_name: z.string(),
});

export async function getPairs(
  params: z.infer<typeof getPairsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain, protocol_name, ...validParams } = getPairsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/protocols/${chain}/${protocol_name}/pairs${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.pairsResponse.parse(data);
}
