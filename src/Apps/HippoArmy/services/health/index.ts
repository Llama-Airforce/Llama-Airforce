import { z } from "zod/v4";
import { fetchJson as fetch } from "@/Utils/fetch";
import { getHost, type Options } from "..";
import { pairId } from "../schema";
import * as Schema from "./schema";

const getLeverageStatsParams = z.object(pairId);

export async function getLeverageStats(
  params: z.infer<typeof getLeverageStatsParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id } = getLeverageStatsParams.parse(params);

  const data = await fetch(
    `${host}/v1/health/${pair_id}/leverage_stats`,
    undefined,
    options?.signal
  );

  return Schema.leverageStatsResponse.parse(data);
}

const getLeverageDistributionParams = z.object(pairId);

export async function getLeverageDistribution(
  params: z.infer<typeof getLeverageDistributionParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id } = getLeverageDistributionParams.parse(params);

  const data = await fetch(
    `${host}/v1/health/${pair_id}/leverage_distribution`,
    undefined,
    options?.signal
  );

  return Schema.leverageDistributionResponse.parse(data);
}

const getDebtDistributionParams = z.object(pairId);

export async function getDebtDistribution(
  params: z.infer<typeof getDebtDistributionParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id } = getDebtDistributionParams.parse(params);

  const data = await fetch(
    `${host}/v1/health/${pair_id}/debt_distribution`,
    undefined,
    options?.signal
  );

  return Schema.debtDistributionResponse.parse(data);
}

const getCollateralRatioDistributionParams = z.object(pairId);

export async function getCollateralRatioDistribution(
  params: z.infer<typeof getCollateralRatioDistributionParams>,
  options?: Options
) {
  const host = getHost(options);
  const { pair_id } = getCollateralRatioDistributionParams.parse(params);

  const data = await fetch(
    `${host}/v1/health/${pair_id}/collateral_ratio_distribution`,
    undefined,
    options?.signal
  );

  return Schema.collateralRatioDistributionResponse.parse(data);
}
