import { bigNumToNumber } from "@/Util";
import { ServiceBase } from "@/Services";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";
import type { ProposalDetails } from "@CM/Pages/DAO/Proposals/Models/ProposalDetails";

const PROPOSAL_URL = "https://api-py.llama.airforce/curve/v1/dao/proposals";
const PROPOSAL_OWNERSHIP_URL =
  "https://api-py.llama.airforce/curve/v1/dao/proposals/ownership/";
const PROPOSAL_PARAMETER_URL =
  "https://api-py.llama.airforce/curve/v1/dao/proposals/parameter/";

type GetProposalsResponse = {
  proposals: {
    voteId: string;
    voteType: "PARAMETER" | "OWNERSHIP";
    creator: string;
    startDate: string;
    snapshotBlock: number;
    metadata: string;
    minAcceptQuorum: string;
    supportRequired: string;
    voteCount: string;
    votesFor: string;
    votesAgainst: string;
    executed: boolean;
    totalSupply: string;
  }[];
};

type GetProposalDetailsResponse = GetProposalsResponse["proposals"][number] & {
  script: string;
  votes: {
    voter: string;
    supports: boolean;
    stake: number;
  }[];
};

const parseProposal = (
  x: GetProposalsResponse["proposals"][number]
): Proposal => {
  const id = parseInt(x.voteId, 10);
  const type = x.voteType === "PARAMETER" ? "parameter" : "gauge";
  const metadata = x.metadata?.startsWith('"') // Remove weird starting quote, if present.
    ? x.metadata.substring(1)
    : x.metadata ?? "";
  const proposer = x.creator;
  const block = x.snapshotBlock;
  const start = parseInt(x.startDate, 10);
  const end = start + 604800;
  const quorum = bigNumToNumber(BigInt(x.minAcceptQuorum), 18n);
  const support = bigNumToNumber(BigInt(x.supportRequired), 18n);
  const votes = parseInt(x.voteCount, 10);
  const votesFor = bigNumToNumber(BigInt(x.votesFor), 18n);
  const votesAgainst = bigNumToNumber(BigInt(x.votesAgainst), 18n);
  const executed = x.executed;
  const totalSupply = bigNumToNumber(BigInt(x.totalSupply), 18n);

  return {
    id,
    type,
    metadata,
    proposer,
    block,
    start,
    end,
    quorum,
    support,
    votes,
    votesFor,
    votesAgainst,
    executed,
    totalSupply,
  };
};

const parseProposalDetails = (
  x: GetProposalDetailsResponse
): ProposalDetails => {
  const script = x.script;
  const votes = x.votes.map((vote) => ({
    voter: vote.voter,
    supports: vote.supports,
    stake: vote.stake / Math.pow(10, 18),
  }));

  return {
    script,
    votes,
  };
};

export default class ProposalService extends ServiceBase {
  public async getProposals(): Promise<Proposal[]> {
    const resp = await this.fetch<GetProposalsResponse>(PROPOSAL_URL);

    return resp.proposals.map(parseProposal);
  }

  public async getProposalDetails(
    proposal: Proposal
  ): Promise<ProposalDetails> {
    const url =
      proposal.type === "gauge"
        ? PROPOSAL_OWNERSHIP_URL
        : PROPOSAL_PARAMETER_URL;

    const resp = await this.fetch<GetProposalDetailsResponse>(
      `${url}${proposal.id}`
    );

    return parseProposalDetails(resp);
  }
}
