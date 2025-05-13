import { z } from "zod";
import { toDate } from "@/Utils/timestamp";

const decimalTimeSeries = z
  .object({
    value: z.string(),
    timestamp: z.number(),
  })
  .transform((data) => ({
    value: parseFloat(data.value),
    timestamp: toDate(data.timestamp),
  }));

export const redemptionsResponse = z
  .object({
    total_allocation: z.string(),
    claim_count: z.number(),
    total_claimed: z.string(),
    history: z.array(decimalTimeSeries),
    total_redeemed: z.string(),
  })
  .transform((data) => ({
    totalAllocation: parseFloat(data.total_allocation),
    claimCount: data.claim_count,
    totalClaimed: parseFloat(data.total_claimed),
    history: data.history,
    totalRedeemed: parseFloat(data.total_redeemed),
  }));

export const projectionResponse = z
  .object({
    projection: z.array(decimalTimeSeries),
    total_vested: z.string(),
    current_unlocked: z.string(),
    current_timestamp: z.number(),
  })
  .transform((data) => ({
    projection: data.projection,
    totalVested: parseFloat(data.total_vested),
    unlocked: parseFloat(data.current_unlocked),
    time: toDate(data.current_timestamp),
  }));

export const airdropResponse = z
  .object({
    total_allocation: z.string(),
    claim_count: z.number(),
    total_claimed: z.string(),
    history: z.array(decimalTimeSeries),
  })
  .transform((data) => ({
    totalAllocation: parseFloat(data.total_allocation),
    claimCount: data.claim_count,
    totalClaimed: parseFloat(data.total_claimed),
    history: data.history,
  }));

export const supplyResponse = z
  .object({
    total_supply: z.string(),
    perma_staked: z.string(),
    airdrop_vesting: z.string(),
    redemption_vesting: z.string(),
    treasury_vesting: z.string(),
    licensing_vesting: z.string(),
    circulating_supply: z.string(),
  })
  .transform((data) => ({
    totalSupply: parseFloat(data.total_supply),
    permaStaked: parseFloat(data.perma_staked),
    airdropVesting: parseFloat(data.airdrop_vesting),
    redemptionVesting: parseFloat(data.redemption_vesting),
    treasuryVesting: parseFloat(data.treasury_vesting),
    licensingVesting: parseFloat(data.licensing_vesting),
    circulatingSupply: parseFloat(data.circulating_supply),
  }));

export type RedemptionsResponse = z.infer<typeof redemptionsResponse>;
export type ProjectionResponse = z.infer<typeof projectionResponse>;
export type AirdropResponse = z.infer<typeof airdropResponse>;
export type SupplyResponse = z.infer<typeof supplyResponse>;

export type Redemption = RedemptionsResponse["history"][number];
export type Projection = ProjectionResponse["projection"][number];
export type Airdrop = AirdropResponse["history"][number];
