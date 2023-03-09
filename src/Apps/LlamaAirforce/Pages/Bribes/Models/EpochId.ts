import type { Product } from "@LAF/Pages/Bribes/Models";

export type EpochId = Product & {
  /** The round number. */
  round: number;
};
