import type { ProposalType } from "@CM/Services/Proposal/ProposalModels";

export type GetProposalsResponse = {
  proposals: {
    vote_id: number;
    vote_type: ProposalType;
    creator: string;
    start_date: number;
    snapshot_block: number;
    ipfs_metadata: string;
    metadata: string;
    votes_for: string;
    votes_against: string;
    vote_count: number;
    support_required: string;
    min_accept_quorum: string;
    total_supply: string;
    executed: boolean;
  }[];
  count: number;
};

export type GetProposalDetailsResponse =
  GetProposalsResponse["proposals"][number] & {
    script: string;
    votes: {
      voter: string;
      supports: boolean;
      voting_power: string;
    }[];
  };
