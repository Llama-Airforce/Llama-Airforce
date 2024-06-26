import type { EpochId, Proposal } from "@LAF/Pages/Bribes/Models";

export type Matches = {
  native: number;
  frax: number;
};

export type EpochFrax = EpochId & Proposal & Matches;
