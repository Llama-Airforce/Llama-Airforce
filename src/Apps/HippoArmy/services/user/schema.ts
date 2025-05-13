import { z } from "zod";
import { toDate } from "@/Utils/timestamp";

const snapshotData = z
  .object({
    date_timestamp: z.number(),
    block_number: z.number(),
    collateral: z.string(),
    underlying: z.string(),
    debt: z.string(),
    collateral_ratio: z.string(),
    borrow_shares: z.string(),
    max_borrowable: z.string(),
    interest_accrued: z.string(),
    redemption_lost: z.string(),
  })
  .transform((data) => ({
    time: toDate(data.date_timestamp),
    blockNumber: data.block_number,
    collateral: parseFloat(data.collateral),
    underlying: parseFloat(data.underlying),
    debt: parseFloat(data.debt),
    collateralRatio: parseFloat(data.collateral_ratio),
    borrowShares: parseFloat(data.borrow_shares),
    maxBorrowable: parseFloat(data.max_borrowable),
    interestAccrued: parseFloat(data.interest_accrued),
    redemptionLost: parseFloat(data.redemption_lost),
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

const positionData = z
  .object({
    pair_id: z.number(),
    pair_name: z.string(),
    last_snapshot_date: z.number(),
    collateral_ratio: z.string(),
    underlying: z.string(),
    debt: z.string(),
    active: z.boolean(),
  })
  .transform((data) => ({
    pairId: data.pair_id,
    pairName: data.pair_name,
    lastSnapshotDate: toDate(data.last_snapshot_date),
    collateralRatio: parseFloat(data.collateral_ratio),
    underlying: parseFloat(data.underlying),
    debt: parseFloat(data.debt),
    active: data.active,
  }));

export const positionsResponse = z
  .object({
    active: z.array(positionData),
    historical: z.array(positionData),
    total_active: z.number(),
    total_historical: z.number(),
  })
  .transform((data) => ({
    active: data.active,
    historical: data.historical,
    totalActive: data.total_active,
    totalHistorical: data.total_historical,
  }));

export type SnapshotsResponse = z.infer<typeof snapshotsResponse>;
export type PositionsResponse = z.infer<typeof positionsResponse>;

export type Snapshot = SnapshotsResponse["snapshots"][number];
export type Position = PositionsResponse["active"][number];
