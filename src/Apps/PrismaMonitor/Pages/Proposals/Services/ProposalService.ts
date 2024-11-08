import { notify } from "@kyvg/vue3-notification";
import { paginate } from "@/Utils/Pagination";
import { ServiceBase } from "@/Services";
import type {
  Proposal,
  ProposalStatus,
} from "@PM/Pages/Proposals/Models/Proposal";

const API_URL = "https://api.prismamonitor.com/v1";

type GetProposalsResponse = {
  proposals: {
    index: number;
    status: ProposalStatus;
    creator: string;
    creator_label: string;
    required_weight: number;
    received_weight: number;
    vote_count: number;
    voters: {
      voter: string;
      weight: number;
    }[];
    execution_tx?: string;
    execution_timestamp?: number;
    can_execute_after: number;
    block_number: number;
    block_timestamp: number;
    transaction_hash: string;
    decode_data: string;
  }[];
};

type GetMetadataResponse = {
  data: {
    proposals: {
      id: number;
      metadata: {
        link: string;
        author: string;
        title: string;
        description: string;
      };
    }[];
  };
};

const parseProposal = (
  x: GetProposalsResponse["proposals"][number],
  metadataResp?: GetMetadataResponse
): Proposal => {
  const id = x.index;
  const proposer = x.creator;
  const proposerLabel = x.creator_label;
  const weightRequired = x.required_weight;
  const weightReceived = x.received_weight;
  const status = x.status;
  const votes = x.vote_count;
  const voters = x.voters.map((y) => ({
    voter: y.voter.toLowerCase(),
    weight: y.weight,
  }));
  const tx = x.transaction_hash;
  const txExecuted = x.execution_tx;
  const executeAfter = x.can_execute_after;
  const block = x.block_number;
  const start = x.block_timestamp;
  const end = x.execution_timestamp ? x.execution_timestamp : start + 604800;
  const script = x.decode_data;

  const metadata = metadataResp?.data.proposals.find(
    (proposal) => proposal.id === id
  )?.metadata;

  return {
    id,
    metadata,
    proposer,
    proposerLabel,
    weightRequired,
    weightReceived,
    status,
    votes,
    voters,
    tx,
    txExecuted,
    executeAfter,
    block,
    start,
    end,
    script,
  };
};

export default class ProposalService extends ServiceBase {
  public async getProposals(): Promise<Proposal[]> {
    let metadata: GetMetadataResponse | undefined = undefined;
    try {
      metadata = await this.fetch<GetMetadataResponse>(
        "https://api.prismafinance.com/api/v1/proposalVotes"
      );
    } catch {
      notify({ text: "Failed to fetch metadata for proposals", type: "error" });
    }

    const fs = (page: number) => {
      return this.fetch<GetProposalsResponse>(
        `${API_URL}/dao/ethereum/ownership/proposals?items=100&page=${page}&order_by=block_timestamp&desc=true`
      ).then((resp) =>
        resp.proposals.map((proposal) => parseProposal(proposal, metadata))
      );
    };

    const proposals = await paginate(fs, 1, 100);

    return proposals;
  }
}
