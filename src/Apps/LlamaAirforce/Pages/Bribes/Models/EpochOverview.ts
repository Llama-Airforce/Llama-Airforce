import type { EpochId, VoteSource } from "@LAF/Pages/Bribes/Models";

export type ProposalId = string;

export type EpochOverview = EpochId & {
  /** The Snapshot proposal ID or Convex on-chain proposal index. */
  proposal: ProposalId;
  end: number;
  voteSource?: VoteSource;

  totalAmountDollars: number;
  dollarPerVlAsset: number;
};
