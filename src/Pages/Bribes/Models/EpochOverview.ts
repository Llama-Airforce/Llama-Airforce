import type { EpochId } from "@/Pages/Bribes/Models/EpochId";

export type ProposalId = string;

export type EpochOverview = EpochId & {
  /** The snapshot proposal ID, like QmacSRTG62rnvAyBuNY3cVbCtBHGV8PuGRoL32Dm6MPy5y */
  proposal: ProposalId;
  end: number;

  totalAmountDollars: number;
  dollarPerVlAsset: number;
};
