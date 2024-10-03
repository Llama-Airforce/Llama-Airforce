export const proposalTypes = [
  "all",
  "ownership",
  "parameter",
  "other",
] as const;
export type ProposalType = (typeof proposalTypes)[number];

export const proposalStatusses = [
  "all",
  "active",
  "denied",
  "passed",
  "executed",
] as const;
export type ProposalStatus = (typeof proposalStatusses)[number];

export type Proposal = {
  id: number;
  type: ProposalType;
  metadata: string;
  proposer: string;
  block: number;
  start: number;
  end: number;
  quorum: number; // Voting power in veCRV.
  support: number; // Voting power in veCRV.
  voteCount: number; // An actual vote *count*
  votesFor: number; // Voting power in veCRV.
  votesAgainst: number; // Voting power in veCRV.
  executed: boolean;
  totalSupply: number; // Voting power in veCRV.
  txCreation: string;
};

export type ProposalDetails = {
  script: string;
  votes: {
    voter: string;
    supports: boolean;
    votingPower: number;
  }[];
};
