import type { Product } from "@LAF/Pages/Bribes/Models";

export type EpochId = Product & {
  /** The round number. */
  round: number;
};

export function toString(epochId: EpochId): string {
  return `${epochId.platform}-${epochId.protocol}-${epochId.round}`;
}
