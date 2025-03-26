import { z } from "zod";
import { fetchJson as fetch } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { chain } from "../schema";
import * as Schema from "./schema";

const getRedemptionsParams = z.object({
  ...chain,
});

export async function getRedemptions(
  params: z.infer<typeof getRedemptionsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getRedemptionsParams.parse(params);

  const data = await fetch(
    `${host}/v1/vesting/${chain}/redemptions`,
    undefined,
    options?.signal
  );

  return Schema.redemptionsResponse.parse(data);
}

const getRedemptionsProjectionParams = z.object({
  ...chain,
});

export async function getRedemptionsProjection(
  params: z.infer<typeof getRedemptionsProjectionParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getRedemptionsProjectionParams.parse(params);

  const data = await fetch(
    `${host}/v1/vesting/${chain}/redemptions/projection`,
    undefined,
    options?.signal
  );

  return Schema.projectionResponse.parse(data);
}

const getAirdropsTeamParams = z.object({
  ...chain,
});

export async function getAirdropsTeam(
  params: z.infer<typeof getAirdropsTeamParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getAirdropsTeamParams.parse(params);

  const data = await fetch(
    `${host}/v1/vesting/${chain}/airdrops/team`,
    undefined,
    options?.signal
  );

  return Schema.airdropResponse.parse(data);
}

const getAirdropsTeamProjectionParams = z.object({
  ...chain,
});

export async function getAirdropsTeamProjection(
  params: z.infer<typeof getAirdropsTeamProjectionParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getAirdropsTeamProjectionParams.parse(params);

  const data = await fetch(
    `${host}/v1/vesting/${chain}/airdrops/team/projection`,
    undefined,
    options?.signal
  );

  return Schema.projectionResponse.parse(data);
}

const getAirdropsVictimsParams = z.object({
  ...chain,
});

export async function getAirdropsVictims(
  params: z.infer<typeof getAirdropsVictimsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getAirdropsVictimsParams.parse(params);

  const data = await fetch(
    `${host}/v1/vesting/${chain}/airdrops/victims`,
    undefined,
    options?.signal
  );

  return Schema.airdropResponse.parse(data);
}

const getAirdropsVictimsProjectionParams = z.object({
  ...chain,
});

export async function getAirdropsVictimsProjection(
  params: z.infer<typeof getAirdropsVictimsProjectionParams>,
  options?: Options
) {
  const host = getHost(options);
  const { chain } = getAirdropsVictimsProjectionParams.parse(params);

  const data = await fetch(
    `${host}/v1/vesting/${chain}/airdrops/victims/projection`,
    undefined,
    options?.signal
  );

  return Schema.projectionResponse.parse(data);
}

export async function getCirculatingSupply(options?: Options) {
  const host = getHost(options);

  const data = await fetch(
    `${host}/v1/vesting/circulating_supply`,
    undefined,
    options?.signal
  );

  return Schema.supplyResponse.parse(data);
}
