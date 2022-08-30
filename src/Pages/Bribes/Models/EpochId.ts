import type { Product } from "@/Pages/Bribes/Models/Product";

export type EpochId = Product & {
  /** The round number. */
  round: number;
};
