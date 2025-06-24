import { z } from "zod/v4";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";

const overviewData = z
  .object({
    name: z.string(),
    protocol_id: z.number(),
    pairs_count: z.number(),
    active_positions_count: z.number(),
    total_collateral: z.string(),
    total_underlying: z.string(),
    total_debt: z.string(),
  })
  .transform((data) => ({
    name: data.name,
    protocolId: data.protocol_id,
    pairsCount: data.pairs_count,
    activePositionsCount: data.active_positions_count,
    totalCollateral: parseFloat(data.total_collateral),
    totalUnderlying: parseFloat(data.total_underlying),
    totalDebt: parseFloat(data.total_debt),
  }));

export const overviewResponse = z
  .object({
    protocols: z.array(overviewData),
    count: z.number(),
  })
  .transform((data) => ({
    protocols: data.protocols,
    count: data.count,
  }));

const tokenData = z
  .object({
    symbol: z.string(),
    name: z.string(),
    address: z.string(),
    precision: z.number(),
  })
  .transform((data) => ({
    symbol: data.symbol,
    name: data.name,
    address: data.address as Address,
    precision: data.precision,
  }));

const rewardsData = z
  .object({
    token_address: z.string(),
    token_symbol: z.string(),
    apr: z.string(),
  })
  .transform((data) => ({
    tokenAddress: data.token_address as Address,
    tokenSymbol: data.token_symbol,
    apr: parseFloat(data.apr),
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
    redemption_fee_10k: z.string(),
    borrow_cost_apr: z.string(),
    base_apr: z.string(),
    rewards: z.array(rewardsData),
    collateral_token: tokenData,
    debt_token: tokenData,
    underlying_token: tokenData,
    pair_collateral_token: tokenData,
    pair_underlying_token: tokenData,
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
    redemptionFee10k: parseFloat(data.redemption_fee_10k),
    aprBorrowCost: parseFloat(data.borrow_cost_apr),
    aprBase: parseFloat(data.base_apr),
    rewards: data.rewards,
    tokenCollateral: data.collateral_token,
    tokenDebt: data.debt_token,
    tokenUnderlying: data.underlying_token,
    tokenPairCollateral: data.pair_collateral_token,
    tokenPairUnderyling: data.pair_underlying_token,
  }));

export const pairsResponse = z
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

const priceData = z
  .object({
    crvusd_price: z.string(),
    frxusd_price: z.string(),
    block_number: z.number(),
    block_timestamp: z.number(),
  })
  .transform((data) => ({
    crvusd: parseFloat(data.crvusd_price),
    frxusd: parseFloat(data.frxusd_price),
    blockNumber: data.block_number,
    timestamp: toDate(data.block_timestamp),
  }));

export const oraclePricesResponse = z
  .object({
    prices: z.array(priceData),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((data) => ({
    prices: data.prices,
    count: data.count,
    page: data.page,
    totalPages: data.total_pages,
  }));

const historyData = z
  .object({
    name: z.string(),
    protocol_id: z.number(),
    pairs_count: z.number(),
    active_positions_count: z.number(),
    total_collateral: z.string(),
    total_underlying: z.string(),
    total_debt: z.string(),
    timestamp: z.number(),
  })
  .transform((data) => ({
    timestamp: toDate(data.timestamp),
    name: data.name,
    protocolId: data.protocol_id,
    pairsCount: data.pairs_count,
    totalCollateral: parseFloat(data.total_collateral),
    totalUnderlying: parseFloat(data.total_underlying),
    totalDebt: parseFloat(data.total_debt),
  }));

export const historyResponse = z
  .object({
    snapshots: z.array(historyData),
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

export type OverviewResponse = z.infer<typeof overviewResponse>;
export type PairsResponse = z.infer<typeof pairsResponse>;
export type OraclesPricesResponse = z.infer<typeof oraclePricesResponse>;
export type HistoryResponse = z.infer<typeof historyResponse>;

export type Pair = PairsResponse["pairs"][number];
export type OraclePrice = OraclesPricesResponse["prices"][number];
export type History = HistoryResponse["snapshots"][number];
