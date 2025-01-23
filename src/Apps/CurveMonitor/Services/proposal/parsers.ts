import { toUTC } from "..";
import type * as Responses from "./responses";
import type * as Models from "./models";

export const parseProposal = (
  x: Responses.GetProposalsResponse["proposals"][number]
): Models.Proposal => {
  const timestamp = toUTC(x.dt);
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
  const quorum = Number(BigInt(x.min_accept_quorum)) / 10 ** 18;
  const support = Number(BigInt(x.support_required)) / 10 ** 18;
  const voteCount = x.vote_count;
  const votesFor = Number(BigInt(x.votes_for)) / 10 ** 18;
  const votesAgainst = Number(BigInt(x.votes_against)) / 10 ** 18;
  const executed = x.executed;
  const totalSupply = Number(BigInt(x.total_supply)) / 10 ** 18;
  const txCreation = x.transaction_hash;

  return {
    timestamp,
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
  x: Responses.GetProposalDetailsResponse
): Models.Proposal & Models.ProposalDetails => {
  const proposal = parseProposal(x);
  const txExecution = x.execution_tx
    ? x.execution_tx.toLocaleLowerCase()
    : undefined;
  const script = x.script;
  const votes = x.votes.map((vote) => ({
    voter: vote.voter.toLocaleLowerCase(),
    supports: vote.supports,
    votingPower: Number(BigInt(vote.voting_power)) / 10 ** 18,
  }));

  return {
    ...proposal,
    txExecution,
    script,
    votes,
  };
};

export const parseUserProposalVote = (
  x: Responses.GetUserProposalVotes["data"][number]
): Models.UserProposalVote => {
  return {
    proposal: parseProposal(x.proposal),
    votes: x.votes.map((vote) => ({
      voter: vote.voter.toLocaleLowerCase(),
      supports: vote.supports,
      weight: BigInt(Math.round(parseFloat(vote.voting_power))),
      txHash: vote.transaction_hash,
    })),
  };
};
