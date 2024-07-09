import type { Product } from "@LAF/Pages/Bribes/Models";

export type EpochId = Product & {
  /** The round number. */
  round: number;
};

export function toString(id: EpochId) {
  return `${id.platform}-${id.protocol}-${id.round}`;
}
