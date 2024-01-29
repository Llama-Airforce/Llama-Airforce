export const proposalStatusses = [
  "active",
  "denied",
  "passed",
  "executed",
] as const;
export type ProposalStatus = (typeof proposalStatusses)[number];

export type Proposal = {
  id: number;
  metadata?: {
    link: string;
    author: string;
    title: string;
    description: string;
  };
  proposer: string;
  proposerLabel: string;
  weightRequired: number;
  weightReceived: number;
  status: ProposalStatus;
  votes: number;
  voters: {
    voter: string;
    weight: number;
  }[];
  tx: string;
  txExecuted?: string;
  executeAfter: number;
  block: number;
  start: number;
  end: number;
  script: string;
};
