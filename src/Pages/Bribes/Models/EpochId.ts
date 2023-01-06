import type { Product } from "@/Pages/Bribes/Models";

export type EpochId = Product & {
  /** The round number. */
  round: number;
};
