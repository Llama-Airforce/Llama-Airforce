export const proposalTypes = ["gauge", "parameter", "other"] as const;
export type ProposalType = typeof proposalTypes[number];

export const proposalStatusses = ["active", "closed"] as const;
export type ProposalStatus = typeof proposalStatusses[number];

export type Proposal = {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  type: ProposalType;
  start: number;
  end: number;
};
