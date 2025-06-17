import { z } from "zod";
import type { Address } from "@/types/address";

export const timerange = {
  start: z.number().int().positive().optional(),
  end: z.number().int().positive().optional(),
};

export const pagination = {
  per_page: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
};

export const proposalId = {
  proposal_id: z.number().int().positive(),
};

export const pairId = {
  pair_id: z.number().int().positive(),
};

export const chain = {
  chain: z.string(),
};

const addressValidator = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

export const userAddress = {
  user_address: addressValidator,
};

export const address = {
  address: addressValidator,
};

export const userData = z
  .object({
    address: z.string(),
    label: z.string().nullable(),
    ens: z.string().nullable(),
    perma_staker: z.boolean(),
  })
  .transform((data) => ({
    address: data.address as Address,
    label: data.label,
    ens: data.ens,
    permaStaker: data.perma_staker,
  }));

export type UserData = z.infer<typeof userData>;
