import type { EpochId, Bribe } from "@LAF/Pages/Bribes/Models";

export type ProposalId = string;
export type VoteSource = "snapshot" | "convex-onchain";

export type Proposal = {
  /** The Snapshot proposal ID or Convex on-chain proposal index. */
  proposal: ProposalId;

  /** Unix timestamp when the proposal voting ends. */
  end: number;

  voteSource?: VoteSource;
};

export type Epoch = EpochId &
  Proposal & {
    /** Raw Votium subgraph round id when it differs from the public LAF round. */
    sourceRound?: number;

    /** How much vlAsset was used to vote for bribes? */
    bribed: { [pool: string]: number };

    /** All bribes for a single epoch. */
    bribes: Bribe[];
  };
