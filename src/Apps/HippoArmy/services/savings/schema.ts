import { z } from "zod/v4";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";

export const statsResponse = z
  .object({
    tvl: z.string(),
    tvl_usd: z.string(),
    current_apr: z.string().nullable(),
    share_price: z.string(),
    unique_depositors: z.number(),
    total_deposited: z.string(),
    total_withdrawn: z.string(),
  })
  .transform((d) => ({
    tvl: parseFloat(d.tvl),
    tvlUsd: parseFloat(d.tvl_usd),
    currentApr: d.current_apr ? parseFloat(d.current_apr) : null,
    sharePrice: parseFloat(d.share_price),
    uniqueDepositors: d.unique_depositors,
    totalDeposited: parseFloat(d.total_deposited),
    totalWithdrawn: parseFloat(d.total_withdrawn),
  }));

export type StatsResponse = z.infer<typeof statsResponse>;

const aprHistoryEntry = z
  .object({ date_timestamp: z.number(), avg_apr: z.string() })
  .transform((d) => ({
    timestamp: toDate(d.date_timestamp),
    apr: parseFloat(d.avg_apr),
  }));

export const aprHistoryResponse = z
  .object({
    data: z.array(aprHistoryEntry),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((d) => ({
    data: d.data,
    count: d.count,
    page: d.page,
    totalPages: d.total_pages,
  }));

export type AprHistoryResponse = z.infer<typeof aprHistoryResponse>;

const tvlHistoryEntry = z
  .object({ date_timestamp: z.number(), tvl: z.string(), tvl_usd: z.string() })
  .transform((d) => ({
    timestamp: toDate(d.date_timestamp),
    tvl: parseFloat(d.tvl),
    tvlUsd: parseFloat(d.tvl_usd),
  }));

export const tvlHistoryResponse = z
  .object({
    data: z.array(tvlHistoryEntry),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((d) => ({
    data: d.data,
    count: d.count,
    page: d.page,
    totalPages: d.total_pages,
  }));

export type TvlHistoryResponse = z.infer<typeof tvlHistoryResponse>;

const volumeHistoryEntry = z
  .object({
    date_timestamp: z.number(),
    deposit_volume: z.string(),
    withdraw_volume: z.string(),
    deposit_volume_usd: z.string(),
    withdraw_volume_usd: z.string(),
  })
  .transform((d) => ({
    timestamp: toDate(d.date_timestamp),
    deposit: parseFloat(d.deposit_volume),
    withdraw: parseFloat(d.withdraw_volume),
    depositUsd: parseFloat(d.deposit_volume_usd),
    withdrawUsd: parseFloat(d.withdraw_volume_usd),
  }));

export const volumeHistoryResponse = z
  .object({
    data: z.array(volumeHistoryEntry),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((d) => ({
    data: d.data,
    count: d.count,
    page: d.page,
    totalPages: d.total_pages,
  }));

export type VolumeHistoryResponse = z.infer<typeof volumeHistoryResponse>;

const eventData = z
  .object({
    event_type: z.enum(["Transfer", "Deposit", "Withdraw"]),
    assets: z.string(),
    shares: z.string(),
    block_timestamp: z.number(),
    tx_hash: z.string(),
    block_number: z.number(),
    user: z.object({
      address: z.string(),
      label: z.string().nullable(),
      ens: z.string().nullable(),
      perma_staker: z.boolean(),
    }),
    sender: z
      .object({
        address: z.string(),
        label: z.string().nullable(),
        ens: z.string().nullable(),
        perma_staker: z.boolean(),
      })
      .nullable(),
    receiver: z
      .object({
        address: z.string(),
        label: z.string().nullable(),
        ens: z.string().nullable(),
        perma_staker: z.boolean(),
      })
      .nullable(),
  })
  .transform((e) => ({
    type: e.event_type.toLowerCase() as "transfer" | "deposit" | "withdraw",
    assets: parseFloat(e.assets),
    shares: parseFloat(e.shares),
    timestamp: toDate(e.block_timestamp),
    txHash: e.tx_hash as Address,
    blockNumber: e.block_number,
    owner: e.user.address as Address,
    sender: e.sender?.address as Address | undefined,
    receiver: e.receiver?.address as Address | undefined,
  }));

export const eventsResponse = z
  .object({
    events: z.array(eventData),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((d) => ({
    events: d.events,
    count: d.count,
    page: d.page,
    totalPages: d.total_pages,
  }));

export type EventsResponse = z.infer<typeof eventsResponse>;

const savingsTopUser = z
  .object({
    address: z.string(),
    label: z.string().nullable(),
    ens: z.string().nullable(),
    current_shares: z.string(),
    current_assets: z.string(),
    percentage: z.string(),
  })
  .transform((u) => ({
    address: u.address as Address,
    label: u.label,
    ens: u.ens,
    currentShares: parseFloat(u.current_shares),
    currentAssets: parseFloat(u.current_assets),
    percentage: parseFloat(u.percentage),
  }));

export const topUsersResponse = z
  .object({
    total_tvl: z.string(),
    total_tvl_usd: z.string(),
    top_users_tvl: z.string(),
    top_users_tvl_usd: z.string(),
    others_tvl: z.string(),
    others_tvl_usd: z.string(),
    users: z.array(savingsTopUser),
  })
  .transform((d) => ({
    totalTvl: parseFloat(d.total_tvl),
    totalTvlUsd: parseFloat(d.total_tvl_usd),
    topUsersTvl: parseFloat(d.top_users_tvl),
    topUsersTvlUsd: parseFloat(d.top_users_tvl_usd),
    othersTvl: parseFloat(d.others_tvl),
    othersTvlUsd: parseFloat(d.others_tvl_usd),
    users: d.users,
  }));

export type TopUsersResponse = z.infer<typeof topUsersResponse>;
