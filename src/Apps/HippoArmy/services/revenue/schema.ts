import { z } from "zod";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";
import { userData } from "../schema";

const distributionData = z
  .object({
    block_timestamp: z.number(),
    tx_hash: z.string(),
    block_number: z.number(),
    operator: userData,
    amount: z.string(),
  })
  .transform((data) => ({
    blockTime: toDate(data.block_timestamp),
    txHash: data.tx_hash as Address,
    blockNumber: data.block_number,
    operator: data.operator,
    amount: parseFloat(data.amount),
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
