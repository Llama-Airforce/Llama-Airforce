import { z } from "zod";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";
import { userData } from "../schema";

const eventData = z
  .object({
    event_type: z.enum(["stake", "unstake"]),
    block_timestamp: z.number(),
    tx_hash: z.string(),
    block_number: z.number(),
    amount: z.string(),
    amount_usd: z.string(),
    account: userData,
  })
  .transform((data) => ({
    eventType: data.event_type,
    blockTime: toDate(data.block_timestamp),
    txHash: data.tx_hash as Address,
    blockNumber: data.block_number,
    amount: parseFloat(data.amount),
    amountUsd: parseFloat(data.amount_usd),
    account: data.account,
  }));

export const eventsResponse = z
  .object({
    events: z.array(eventData),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((data) => ({
    events: data.events,
    count: data.count,
    page: data.page,
    totalPages: data.total_pages,
  }));

const cooldownQueueEntry = z
  .object({
    account: userData,
    amount: z.string(),
    amount_usd: z.string(),
    end_timestamp: z.number(),
    block_timestamp: z.number(),
    tx_hash: z.string(),
  })
  .transform((data) => ({
    account: data.account,
    amount: parseFloat(data.amount),
    amountUsd: parseFloat(data.amount_usd),
    end: toDate(data.end_timestamp),
    blockTime: toDate(data.block_timestamp),
    txHash: data.tx_hash as Address,
  }));

export const cooldownQueueResponse = z
  .object({
    entries: z.array(cooldownQueueEntry),
  })
  .transform((data) => ({
    entries: data.entries,
  }));

const aprHistoryEntry = z
  .object({
    timestamp: z.number(),
    token_address: z.string(),
    token_symbol: z.string(),
    apr: z.string(),
  })
  .transform((data) => ({
    timestamp: toDate(data.timestamp),
    tokenAddress: data.token_address as Address,
    tokenSymbol: data.token_symbol,
    apr: parseFloat(data.apr),
  }));

export const aprHistoryResponse = z
  .object({
    snapshots: z.array(aprHistoryEntry),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((data) => ({
    snapshots: data.snapshots,
    count: data.count,
    page: data.page,
    totalPages: data.total_pages,
  }));

const tvlHistoryEntry = z
  .object({
    timestamp: z.number(),
    tvl: z.string(),
    tvl_usd: z.string(),
  })
  .transform((data) => ({
    timestamp: toDate(data.timestamp),
    tvl: parseFloat(data.tvl),
    tvlUsd: parseFloat(data.tvl_usd),
  }));

export const tvlHistoryResponse = z
  .object({
    data: z.array(tvlHistoryEntry),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((data) => ({
    data: data.data,
    count: data.count,
    page: data.page,
    totalPages: data.total_pages,
  }));

const userPosition = z
  .object({
    address: z.string(),
    label: z.string().nullable(),
    ens: z.string().nullable(),
    position_value: z.string(),
    position_value_usd: z.string(),
  })
  .transform((data) => ({
    address: data.address as Address,
    label: data.label,
    ens: data.ens,
    positionValue: parseFloat(data.position_value),
    positionValueUsd: parseFloat(data.position_value_usd),
  }));

export const topUsersResponse = z
  .object({
    total_tvl: z.string(),
    total_tvl_usd: z.string(),
    top_users_tvl: z.string(),
    top_users_tvl_usd: z.string(),
    others_tvl: z.string(),
    others_tvl_usd: z.string(),
    users: z.array(userPosition),
  })
  .transform((data) => ({
    totalTvl: parseFloat(data.total_tvl),
    totalTvlUsd: parseFloat(data.total_tvl_usd),
    topUsersTvl: parseFloat(data.top_users_tvl),
    topUsersTvlUsd: parseFloat(data.top_users_tvl_usd),
    othersTvl: parseFloat(data.others_tvl),
    othersTvlUsd: parseFloat(data.others_tvl_usd),
    users: data.users,
  }));

const histogramBin = z
  .object({
    min_value_usd: z.string(),
    max_value_usd: z.string(),
    count: z.number(),
  })
  .transform((data) => ({
    minValueUsd: parseFloat(data.min_value_usd),
    maxValueUsd: parseFloat(data.max_value_usd),
    count: data.count,
  }));

export const positionHistogramResponse = z
  .object({
    bins: z.array(histogramBin),
    total_users: z.number(),
  })
  .transform((data) => ({
    bins: data.bins,
    totalUsers: data.total_users,
  }));

const weightData = z
  .object({
    epoch: z.number(),
    timestamp: z.number(),
    weight: z.string(),
    relative_weight: z.string(),
  })
  .transform((data) => ({
    epoch: data.epoch,
    timestamp: toDate(data.timestamp),
    weight: parseFloat(data.weight),
    weightRelative: parseFloat(data.relative_weight),
  }));

export const votingWeightHistoryResponse = z
  .object({
    address: z.string(),
    weights: z.array(weightData),
  })
  .transform((data) => ({
    adress: data.address as Address,
    weights: data.weights,
  }));

const distributionHistoryData = z
  .object({
    timestamp: z.number(),
    total_staked: z.string(),
    cooldown_amount: z.string(),
    cooldown_percentage: z.string(),
    regular_staked_amount: z.string(),
    regular_staked_percentage: z.string(),
    perma_staked_amount: z.string(),
    perma_staked_percentage: z.string(),
    cooldown_percentage_excluding_perma: z.string(),
    regular_staked_percentage_excluding_perma: z.string(),
  })
  .transform((data) => ({
    timestamp: toDate(data.timestamp),
    totalStaked: parseFloat(data.total_staked),
    cooldownAmount: parseFloat(data.cooldown_amount),
    cooldownPercentage: parseFloat(data.cooldown_percentage),
    regularStakedAmount: parseFloat(data.regular_staked_amount),
    regularStakedPercentage: parseFloat(data.regular_staked_percentage),
    permaStakedAmount: parseFloat(data.perma_staked_amount),
    permaStakedPercentage: parseFloat(data.perma_staked_percentage),
    cooldownPercentageExcludingPerma: parseFloat(
      data.cooldown_percentage_excluding_perma
    ),
    regularStakedPercentageExcludingPerma: parseFloat(
      data.regular_staked_percentage_excluding_perma
    ),
  }));

export const distributionHistoryResponse = z
  .object({
    data: z.array(distributionHistoryData),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((data) => ({
    data: data.data,
    count: data.count,
    page: data.page,
    totalPages: data.total_pages,
  }));

export type EventsResponse = z.infer<typeof eventsResponse>;
export type CooldownQueueResponse = z.infer<typeof cooldownQueueResponse>;
export type AprHistoryResponse = z.infer<typeof aprHistoryResponse>;
export type TvlHistoryResponse = z.infer<typeof tvlHistoryResponse>;
export type TopUsersResponse = z.infer<typeof topUsersResponse>;
export type PositionHistogramResponse = z.infer<
  typeof positionHistogramResponse
>;
export type VotingWeightHistoryResponse = z.infer<
  typeof votingWeightHistoryResponse
>;
export type DistributionHistoryResponse = z.infer<
  typeof distributionHistoryResponse
>;

export type Event = EventsResponse["events"][number];
export type TopUser = TopUsersResponse["users"][number];
export type Cooldown = CooldownQueueResponse["entries"][number];
export type Bin = PositionHistogramResponse["bins"][number];
export type VotingWeight = VotingWeightHistoryResponse["weights"][number];
export type Distribution = DistributionHistoryResponse["data"][number];
