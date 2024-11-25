import type { ProposalType } from "./Models";

type Proposal = {
  vote_id: number;
  vote_type: ProposalType;
  creator: string;
  start_date: number;
  snapshot_block: number;
  ipfs_metadata: string;
  metadata?: string;
  votes_for: string;
  votes_against: string;
  vote_count: number;
  support_required: string;
  min_accept_quorum: string;
  total_supply: string;
  executed: boolean;
  transaction_hash: string;
  dt: string;
};

export type GetProposalsResponse = {
  proposals: Proposal[];
  count: number;
};

export type GetProposalDetailsResponse = Proposal & {
  execution_tx: string | null;
  script: string;
  votes: {
    voter: string;
    supports: boolean;
    voting_power: string;
  }[];
};

export type GetUserProposalVotes = {
  page: number;
  count: number;
  data: {
    proposal: Proposal;
    votes: {
      voter: string;
      supports: boolean;
      voting_power: string;
      transaction_hash: string;
    }[];
  }[];
};
