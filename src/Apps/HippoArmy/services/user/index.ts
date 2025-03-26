import { z } from "zod";
import { fetchJson as fetch } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { pagination, pairId, timerange, userAddress } from "../schema";
import * as Schema from "./schema";

const getSnapshotsParams = z.object({
  ...pairId,
  ...userAddress,
  ...timerange,
  ...pagination,
});

export async function getSnapshots(
  params: z.infer<typeof getSnapshotsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id, user_address, ...validParams } =
    getSnapshotsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/users/${pair_id}/${user_address}/snapshots${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.snapshotsResponse.parse(data);
}

const getPositionsParams = z.object({
  ...userAddress,
});

export async function getPositions(
  params: z.infer<typeof getPositionsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { user_address } = getPositionsParams.parse(params);

  const data = await fetch(
    `${host}/v1/users/${user_address}/positions`,
    undefined,
    options?.signal
  );

  return Schema.positionsResponse.parse(data);
}
