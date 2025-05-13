import { z } from "zod";
import type { Address } from "@/types/address";

export const timerange = {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  start: z.number().int().positive().optional(),
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  end: z.number().int().positive().optional(),
};

export const pagination = {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  per_page: z.number().int().positive().optional(),
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  page: z.number().int().positive().optional(),
};

export const proposalId = {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  proposal_id: z.number().int().positive(),
};

export const pairId = {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
