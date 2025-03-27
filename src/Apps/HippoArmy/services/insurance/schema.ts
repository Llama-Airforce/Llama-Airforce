import { z } from "zod";
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

// Deposit event schema
const depositEventData = baseEventData
  .refine((data) => data.event_type === "deposit", {
    message: "Expected deposit event type",
  })
  .transform(transformBaseEvent);

// Withdraw event schema
const withdrawEventData = baseEventData
  .extend({
    receiver: userData, // Add withdraw-specific field
  })
  .refine((data) => data.event_type === "withdraw", {
    message: "Expected withdraw event type",
  })
  .transform((data) => ({
    ...transformBaseEvent(data),
    receiver: data.receiver,
  }));

const eventsResponse = z
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

const cooldownQueueResponse = z
  .object({
    entries: z.array(cooldownQueueEntry),
  })
  .transform((data) => ({
    entries: data.entries,
  }));

export { eventsResponse, cooldownQueueResponse };

export type EventsResponse = z.infer<typeof eventsResponse>;
export type CooldownQueueResponse = z.infer<typeof cooldownQueueResponse>;
