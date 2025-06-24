import { z } from "zod/v4";

const collateralRatioBin = z
  .object({
    range_label: z.string(),
    user_count: z.number(),
    total_debt: z.string(),
  })
  .transform((data) => ({
    rangeLabel: data.range_label,
    userCount: data.user_count,
    totalDebt: parseFloat(data.total_debt),
  }));

export const collateralRatioDistributionResponse = z
  .object({
    bins: z.array(collateralRatioBin),
    total_users: z.number(),
    total_debt: z.string(),
    min_ratio: z.string(),
    max_ratio: z.string(),
    median_ratio: z.string(),
  })
  .transform((data) => ({
    bins: data.bins,
    totalUsers: data.total_users,
    totalDebt: parseFloat(data.total_debt),
    minRatio: parseFloat(data.min_ratio),
    maxRatio: parseFloat(data.max_ratio),
    medianRatio: parseFloat(data.median_ratio),
  }));

const debtBin = z
  .object({
    range_label: z.string(),
    user_count: z.number(),
    total_debt: z.string(),
  })
  .transform((data) => ({
    rangeLabel: data.range_label,
    userCount: data.user_count,
    totalDebt: parseFloat(data.total_debt),
  }));

export const debtDistributionResponse = z
  .object({
    bins: z.array(debtBin),
    total_users: z.number(),
    total_debt: z.string(),
    min_debt: z.string(),
    max_debt: z.string(),
    median_debt: z.string(),
  })
  .transform((data) => ({
    bins: data.bins,
    totalUsers: data.total_users,
    totalDebt: parseFloat(data.total_debt),
    minDebt: parseFloat(data.min_debt),
    maxDebt: parseFloat(data.max_debt),
    medianDebt: parseFloat(data.median_debt),
  }));

const leverageStats = z
  .object({
    leveraged_users_count: z.number(),
    non_leveraged_users_count: z.number(),
    leveraged_debt: z.string(),
    non_leveraged_debt: z.string(),
    total_users: z.number(),
    total_debt: z.string(),
    leveraged_users_percentage: z.string(),
    leveraged_debt_percentage: z.string(),
  })
  .transform((data) => ({
    leveragedUsersCount: data.leveraged_users_count,
    nonLeveragedUsersCount: data.non_leveraged_users_count,
    leveragedDebt: parseFloat(data.leveraged_debt),
    nonLeveragedDebt: parseFloat(data.non_leveraged_debt),
    totalUsers: data.total_users,
    totalDebt: parseFloat(data.total_debt),
    leveragedUsersPercentage: parseFloat(data.leveraged_users_percentage),
    leveragedDebtPercentage: parseFloat(data.leveraged_debt_percentage),
  }));

export const leverageStatsResponse = z
  .object({
    stats: leverageStats,
  })
  .transform((data) => ({
    stats: data.stats,
  }));

const leverageBin = z
  .object({
    range_label: z.string(),
    user_count: z.number(),
    total_debt: z.string(),
  })
  .transform((data) => ({
    rangeLabel: data.range_label,
    userCount: data.user_count,
    totalDebt: parseFloat(data.total_debt),
  }));

export const leverageDistributionResponse = z
  .object({
    bins: z.array(leverageBin),
    total_users: z.number(),
    total_debt: z.string(),
  })
  .transform((data) => ({
    bins: data.bins,
    totalUsers: data.total_users,
    totalDebt: parseFloat(data.total_debt),
  }));

export type LeverageStatsResponse = z.infer<typeof leverageStatsResponse>;
export type LeverageDistributionResponse = z.infer<
  typeof leverageDistributionResponse
>;
export type DebtDistributionResponse = z.infer<typeof debtDistributionResponse>;
export type CollateralRatioDistributionResponse = z.infer<
  typeof collateralRatioDistributionResponse
>;
