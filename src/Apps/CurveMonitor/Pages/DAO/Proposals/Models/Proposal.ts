export const proposalTypes = ["gauge", "parameter", "other"] as const;
export type ProposalType = typeof proposalTypes[number];

export const proposalStatusses = [
  "active",
  "denied",
  "passed",
  "executed",
] as const;
export type ProposalStatus = typeof proposalStatusses[number];

export type Proposal = {
  id: string;
  type: ProposalType;
  metadata: string;
  proposer: string;
  start: number;
  end: number;
  quorum: number; // Voting power in veCRV.
  support: number; // Voting power in veCRV.
  votes: number; // An actual vote *count*
  votesFor: number; // Voting power in veCRV.
  votesAgainst: number; // Voting power in veCRV.
  executed: boolean;
  totalSupply: number; // Voting power in veCRV.
};
