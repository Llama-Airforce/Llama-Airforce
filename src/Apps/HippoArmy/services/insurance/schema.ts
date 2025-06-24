import { z } from "zod/v4";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";
import { userData } from "../schema";

const baseEventData = z.object({
  event_type: z.enum(["deposit", "withdraw"]),
  block_timestamp: z.number(),
  tx_hash: z.string(),
  block_number: z.number(),
  assets: z.string(),
  shares: z.string(),
  sender: userData,
  owner: userData,
});

const transformBaseEvent = (data: z.infer<typeof baseEventData>) => ({
  eventType: data.event_type,
  blockTime: toDate(data.block_timestamp),
  txHash: data.tx_hash as Address,
  blockNumber: data.block_number,
  assets: parseFloat(data.assets),
  shares: parseFloat(data.shares),
  sender: data.sender,
  owner: data.owner,
});

const depositEventData = baseEventData
  .refine((data) => data.event_type === "deposit", {
    message: "Expected deposit event type",
  })
  .transform(transformBaseEvent);

const withdrawEventData = baseEventData
  .extend({
    receiver: userData,
  })
  .refine((data) => data.event_type === "withdraw", {
    message: "Expected withdraw event type",
  })
  .transform((data) => ({
    ...transformBaseEvent(data),
    receiver: data.receiver,
  }));

export const eventsResponse = z
  .object({
    events: z.array(z.union([depositEventData, withdrawEventData])),
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
    end_timestamp: z.number(),
    block_timestamp: z.number(),
    tx_hash: z.string(),
  })
  .transform((data) => ({
    account: data.account,
    amount: parseFloat(data.amount),
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
  })
  .transform((data) => ({
    timestamp: toDate(data.timestamp),
    tvl: parseFloat(data.tvl),
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
  })
  .transform((data) => ({
    address: data.address as Address,
    label: data.label,
    ens: data.ens,
    positionValue: parseFloat(data.position_value),
  }));

export const topUsersResponse = z
  .object({
    total_tvl: z.string(),
    top_users_tvl: z.string(),
    others_tvl: z.string(),
    users: z.array(userPosition),
  })
  .transform((data) => ({
    totalTvl: parseFloat(data.total_tvl),
    topUsersTvl: parseFloat(data.top_users_tvl),
    othersTvl: parseFloat(data.others_tvl),
    users: data.users,
  }));

const histogramBin = z
  .object({
    min_value: z.string(),
    max_value: z.string(),
    count: z.number(),
  })
  .transform((data) => ({
    minValue: parseFloat(data.min_value),
    maxValue: parseFloat(data.max_value),
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

const distributionHistoryData = z
  .object({
    timestamp: z.number(),
    total_staked: z.string(),
    cooldown_amount: z.string(),
    cooldown_percentage: z.string(),
    active_staked_amount: z.string(),
    active_staked_percentage: z.string(),
  })
  .transform((data) => ({
    timestamp: toDate(data.timestamp),
    totalStaked: parseFloat(data.total_staked),
    cooldownAmount: parseFloat(data.cooldown_amount),
    cooldownPercentage: parseFloat(data.cooldown_percentage),
    activeStakedAmount: parseFloat(data.active_staked_amount),
    activeStakedPercentage: parseFloat(data.active_staked_percentage),
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
export type DistributionHistoryResponse = z.infer<
  typeof distributionHistoryResponse
>;

export type Event = EventsResponse["events"][number];
export type TopUser = TopUsersResponse["users"][number];
export type Cooldown = CooldownQueueResponse["entries"][number];
export type Bin = PositionHistogramResponse["bins"][number];
export type Distribution = DistributionHistoryResponse["data"][number];
