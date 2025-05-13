import { z } from "zod";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";
import { userData } from "../schema";

const eventType = z.enum([
  "borrow",
  "add_collateral",
  "remove_collateral",
  "repay",
  "redeem",
  "liquidate",
  "leveraged_position",
  "repay_with_collateral",
]);

const rewardData = z
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

const snapshotData = z
  .object({
    date_timestamp: z.number(),
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
    borrow_cost_apr: z.string(),
    base_apr: z.string(),
    rewards: z.array(rewardData),
  })
  .transform((data) => ({
    time: toDate(data.date_timestamp),
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
    aprBorrowCost: parseFloat(data.borrow_cost_apr),
    aprBase: parseFloat(data.base_apr),
    rewards: data.rewards,
  }));

export const snapshotsResponse = z
  .object({
    snapshots: z.array(snapshotData),
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

const collateralEventData = z
  .object({
    event_type: eventType,
    block_timestamp: z.number(),
    tx_hash: z.string(),
    block_number: z.number(),
    collateral_change: z.string(),
    debt_change: z.string(),
  })
  .transform((data) => ({
    eventType: data.event_type,
    blockTime: toDate(data.block_timestamp),
    txHash: data.tx_hash as Address,
    blockNumber: data.block_number,
    collateralChange: parseFloat(data.collateral_change),
    debtChange: parseFloat(data.debt_change),
  }));

export const collateralEventsResponse = z
  .object({
    events: z.array(collateralEventData),
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

const redemptionData = z
  .object({
    block_timestamp: z.number(),
    tx_hash: z.string(),
    block_number: z.number(),
    caller: userData,
    amount: z.string(),
    collateral_freed: z.string(),
    protocol_fee: z.string(),
    debt_reduction: z.string(),
  })
  .transform((data) => ({
    blockTime: toDate(data.block_timestamp),
    txHash: data.tx_hash as Address,
    blockNumber: data.block_number,
    caller: data.caller,
    amount: parseFloat(data.amount),
    collateralFreed: parseFloat(data.collateral_freed),
    protocolFee: parseFloat(data.protocol_fee),
    debtReduction: parseFloat(data.debt_reduction),
  }));

export const redemptionsResponse = z
  .object({
    events: z.array(redemptionData),
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

const liquidationData = z
  .object({
    block_timestamp: z.number(),
    tx_hash: z.string(),
    block_number: z.number(),
    borrower: userData,
    liquidator: userData,
    collateral_for_liquidator: z.string(),
    shares_liquidated: z.string(),
    amount_liquidator_to_repay: z.string(),
  })
  .transform((data) => ({
    blockTime: toDate(data.block_timestamp),
    txHash: data.tx_hash as Address,
    blockNumber: data.block_number,
    borrower: data.borrower,
    liquidator: data.liquidator,
    collateralForLiquidator: parseFloat(data.collateral_for_liquidator),
    sharesLiquidated: parseFloat(data.shares_liquidated),
    amountLiquidatorToRepay: parseFloat(data.amount_liquidator_to_repay),
  }));

export const liquidationsResponse = z
  .object({
    events: z.array(liquidationData),
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

export type SnapshotsResponse = z.infer<typeof snapshotsResponse>;
export type CollateralEventsResponse = z.infer<typeof collateralEventsResponse>;
export type RedemptionsResponse = z.infer<typeof redemptionsResponse>;
export type LiquidationsResponse = z.infer<typeof liquidationsResponse>;

export type Snapshot = SnapshotsResponse["snapshots"][number];
export type CollateralEvent = CollateralEventsResponse["events"][number];
export type Redemption = RedemptionsResponse["events"][number];
export type Liquidation = LiquidationsResponse["events"][number];
