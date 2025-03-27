import { z } from "zod";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";

const overviewData = z
  .object({
    name: z.string(),
    protocol_id: z.number(),
    pairs_count: z.number(),
    active_positions_count: z.number(),
    total_collateral: z.string(),
    total_debt: z.string(),
  })
  .transform((data) => ({
    name: data.name,
    protocolId: data.protocol_id,
    pairsCount: data.pairs_count,
    activePositionsCount: data.active_positions_count,
    totalCollateral: parseFloat(data.total_collateral),
    totalDebt: parseFloat(data.total_debt),
  }));

const overviewResponse = z
  .object({
    protocols: z.array(overviewData),
    count: z.number(),
  })
  .transform((data) => ({
    protocols: data.protocols,
    count: data.count,
  }));

const pairData = z
  .object({
    pair_id: z.number(),
    name: z.string(),
    address: z.string(),
    total_collateral: z.string(),
    total_underlying: z.string(),
    exchange_rate: z.string(),
    total_debt: z.string(),
    active_positions_count: z.number(),
    borrow_limit: z.string(),
    utilization_rate: z.string(),
    interest_rate: z.string(),
    claimable_fees: z.string(),
    claimable_other_fees: z.string(),
    block_timestamp: z.number(),
    last_redemption: z.number().nullable(),
  })
  .transform((data) => ({
    pairId: data.pair_id,
    name: data.name,
    address: data.address as Address,
    totalCollateral: parseFloat(data.total_collateral),
    totalUnderlying: parseFloat(data.total_underlying),
    exchangeRate: parseFloat(data.exchange_rate),
    totalDebt: parseFloat(data.total_debt),
    activePositionsCount: data.active_positions_count,
    borrowLimit: parseFloat(data.borrow_limit),
    utilizationRate: parseFloat(data.utilization_rate),
    interestRate: parseFloat(data.interest_rate),
    claimableFees: parseFloat(data.claimable_fees),
    claimableOtherFees: parseFloat(data.claimable_other_fees),
    blockTime: toDate(data.block_timestamp),
    lastRedemption: data.last_redemption ? toDate(data.last_redemption) : null,
  }));

const pairsResponse = z
  .object({
    pairs: z.array(pairData),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((data) => ({
    pairs: data.pairs,
    count: data.count,
    page: data.page,
    totalPages: data.total_pages,
  }));

export { overviewResponse, pairsResponse };

export type OverviewResponse = z.infer<typeof overviewResponse>;
export type PairsResponse = z.infer<typeof pairsResponse>;
