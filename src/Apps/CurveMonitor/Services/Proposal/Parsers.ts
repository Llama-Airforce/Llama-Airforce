import { bigNumToNumber } from "@/Util";
import type * as ApiTypes from "@CM/Services/Proposal/ApiTypes";
import type * as Models from "@CM/Services/Proposal/Models";

export const parseProposal = (
  x: ApiTypes.GetProposalsResponse["proposals"][number]
): Models.Proposal => {
  const id = x.vote_id;

  const type =
    x.vote_type.toLocaleLowerCase() === "parameter" ? "parameter" : "ownership";

  const metadata = x.metadata?.startsWith('"') // Remove weird starting quote, if present.
    ? x.metadata.substring(1)
    : x.metadata ?? "";

  const proposer = x.creator.toLocaleLowerCase();
  const block = x.snapshot_block;
  const start = x.start_date;
  const end = start + 604800;
  const quorum = bigNumToNumber(BigInt(x.min_accept_quorum), 18n);
  const support = bigNumToNumber(BigInt(x.support_required), 18n);
  const voteCount = x.vote_count;
  const votesFor = bigNumToNumber(BigInt(x.votes_for), 18n);
  const votesAgainst = bigNumToNumber(BigInt(x.votes_against), 18n);
  const executed = x.executed;
  const totalSupply = bigNumToNumber(BigInt(x.total_supply), 18n);
  const txCreation = x.transaction_hash;

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
    voteCount,
    votesFor,
    votesAgainst,
    executed,
    totalSupply,
    txCreation,
  };
};

export const parseProposalDetails = (
  x: ApiTypes.GetProposalDetailsResponse
): Models.Proposal & Models.ProposalDetails => {
  const proposal = parseProposal(x);
  const script = x.script;
  const votes = x.votes.map((vote) => ({
    voter: vote.voter.toLocaleLowerCase(),
    supports: vote.supports,
    votingPower: bigNumToNumber(BigInt(vote.voting_power), 18n),
  }));

  return {
    ...proposal,
    script,
    votes,
  };
};
