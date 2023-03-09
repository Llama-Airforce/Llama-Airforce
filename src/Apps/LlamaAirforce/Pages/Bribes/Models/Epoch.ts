import type { EpochId, Bribe } from "@LAF/Pages/Bribes/Models";

export type ProposalId = string;

export type Proposal = {
  /** The snapshot proposal ID, like QmacSRTG62rnvAyBuNY3cVbCtBHGV8PuGRoL32Dm6MPy5y */
  proposal: ProposalId;

  /** Unix timestamp when the proposal voting ends. */
  end: number;
};

export type Epoch = EpochId &
  Proposal & {
    /** How much vlAsset was used to vote for bribes? */
    bribed: { [pool: string]: number };

    /** All bribes for a single epoch. */
    bribes: Bribe[];
  };
