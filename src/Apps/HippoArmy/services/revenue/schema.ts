import { z } from "zod";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";
import { userData } from "../schema";

const breakdownData = z
  .object({
    pair_id: z.number(),
    pair_name: z.string(),
    protocol_name: z.string(),
    interest: z.string(),
    fees: z.string(),
  })
  .transform((data) => ({
    pairId: data.pair_id,
    pairName: data.pair_name,
    protocolName: data.protocol_name,
    interest: parseFloat(data.interest),
    fees: parseFloat(data.fees),
  }));

const distributionData = z
  .object({
    block_timestamp: z.number(),
    tx_hash: z.string(),
    block_number: z.number(),
    operator: userData,
    amount: z.string(),
    interest_total: z.string(),
    fees_total: z.string(),
    breakdown: z.array(breakdownData),
  })
  .transform((data) => ({
    blockTime: toDate(data.block_timestamp),
    txHash: data.tx_hash as Address,
    blockNumber: data.block_number,
    operator: data.operator,
    amount: parseFloat(data.amount),
    interestTotal: parseFloat(data.interest_total),
    feesTotal: parseFloat(data.fees_total),
    breakdown: data.breakdown,
  }));

export const distributionsResponse = z
  .object({
    distributions: z.array(distributionData),
    count: z.number(),
    page: z.number(),
    total_pages: z.number(),
  })
  .transform((data) => ({
    distributions: data.distributions,
    count: data.count,
    page: data.page,
    totalPages: data.total_pages,
  }));

export type DistributionsResponse = z.infer<typeof distributionsResponse>;

export type Distribution = DistributionsResponse["distributions"][number];
