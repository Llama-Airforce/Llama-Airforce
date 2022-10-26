import type { Proposal } from "@/Pages/Bribes/Models/Epoch";
import type { EpochId } from "@/Pages/Bribes/Models/EpochId";

export type Matches = {
  native: number;
  frax: number;
};

export type EpochFrax = EpochId & Proposal & Matches;
