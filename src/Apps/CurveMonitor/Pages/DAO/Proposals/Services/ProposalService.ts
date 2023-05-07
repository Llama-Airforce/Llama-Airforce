import { BigNumber } from "ethers";
import { bigNumToNumber } from "@/Util";
import ServiceBase from "@/Services/ServiceBase";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";
import type { ProposalDetails } from "@CM/Pages/DAO/Proposals/Models/ProposalDetails";

const PROPOSAL_URL = "https://api-py.llama.airforce/curve/v1/dao/proposals";
const PROPOSAL_OWNERSHIP_URL =
  "https://api-py.llama.airforce/curve/v1/dao/proposals/ownership/";
const PROPOSAL_PARAMETER_URL =
  "https://api-py.llama.airforce/curve/v1/dao/proposals/parameter/";

export type GetProposalsResponse = {
  proposals: {
    voteId: string;
    voteType: "PARAMETER" | "OWNERSHIP";
    creator: string;
    startDate: string;
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

export type GetProposalDetailsResponse =
  GetProposalsResponse["proposals"][number] & {
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
  const id = x.voteId;
  const type = x.voteType === "PARAMETER" ? "parameter" : "gauge";
  const metadata = x.metadata;
  const proposer = x.creator;
  const start = parseInt(x.startDate, 10);
  const end = start + 604800;
  const quorum = bigNumToNumber(BigNumber.from(x.minAcceptQuorum), 18);
  const support = bigNumToNumber(BigNumber.from(x.supportRequired), 18);
  const votes = parseInt(x.voteCount, 10);
  const votesFor = bigNumToNumber(BigNumber.from(x.votesFor), 18);
  const votesAgainst = bigNumToNumber(BigNumber.from(x.votesAgainst), 18);
  const executed = x.executed;
  const totalSupply = bigNumToNumber(BigNumber.from(x.totalSupply), 18);

  return {
    id,
    type,
    metadata,
    proposer,
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
    const resp = await this.fetchType<GetProposalsResponse>(PROPOSAL_URL);

    return resp.proposals.map(parseProposal);
  }

  public async getProposalDetails(
    proposal: Proposal
  ): Promise<ProposalDetails> {
    const url =
      proposal.type === "gauge"
        ? PROPOSAL_OWNERSHIP_URL
        : PROPOSAL_PARAMETER_URL;

    const resp = await this.fetchType<GetProposalDetailsResponse>(
      `${url}${proposal.id}`
    );

    return parseProposalDetails(resp);
  }
}
