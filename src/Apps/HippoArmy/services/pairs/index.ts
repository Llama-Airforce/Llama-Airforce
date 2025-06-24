import { z } from "zod/v4";
import { fetchJson as fetch, addQueryString } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { pagination, pairId, timerange } from "../schema";
import * as Schema from "./schema";

const getSnapshotsParams = z.object({
  ...pairId,
  ...timerange,
  ...pagination,
});

export async function getSnapshots(
  params: z.infer<typeof getSnapshotsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id, ...validParams } = getSnapshotsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/pairs/${pair_id}/snapshots${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.snapshotsResponse.parse(data);
}

const getCollateralEventsParams = z.object({
  ...pairId,
  ...timerange,
  ...pagination,
});

export async function getCollateralEvents(
  params: z.infer<typeof getCollateralEventsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id, ...validParams } = getCollateralEventsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/pairs/${pair_id}/collateral_events${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.collateralEventsResponse.parse(data);
}

const getRedemptionsParams = z.object({
  ...pairId,
  ...timerange,
  ...pagination,
});

export async function getRedemptions(
  params: z.infer<typeof getRedemptionsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id, ...validParams } = getRedemptionsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/pairs/${pair_id}/redemptions${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.redemptionsResponse.parse(data);
}

const getLiquidationsParams = z.object({
  ...pairId,
  ...timerange,
  ...pagination,
});

export async function getLiquidations(
  params: z.infer<typeof getLiquidationsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id, ...validParams } = getLiquidationsParams.parse(params);
  const queryString = addQueryString(validParams);

  const data = await fetch(
    `${host}/v1/pairs/${pair_id}/liquidations${queryString}`,
    undefined,
    options?.signal
  );

  return Schema.liquidationsResponse.parse(data);
}
