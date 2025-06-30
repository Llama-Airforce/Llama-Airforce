import { z } from "zod/v4";
import type { Address } from "@/types/address";
import { toDate } from "@/Utils/timestamp";

const proposalStatusFilter = z.enum([
  "all",
  "active",
  "failed",
  "cancelled",
  "executed",
  "executable",
]);

const actions = z
  .object({
    index: z.number(),
    target: z.string(),
    calldata: z.string(),
    decoded_calldata: z.string(),
  })
  .transform((data) => ({
    index: data.index,
    target: data.target,
    calldata: data.calldata,
    decodedCalldata: data.decoded_calldata,
  }));

const proposalData = z
  .object({
    proposal_id: z.number(),
    on_chain_id: z.number(),
    description: z.string(),
    creator: z.string(),
    creator_ens: z.string().nullable(),
    creator_label: z.string().nullable(),
    status: proposalStatusFilter,
    epoch: z.number(),
    created_at: z.number(),
    quorum_weight: z.number(),
    execution_tx: z.string().nullable(),
    cancellation_tx: z.string().nullable(),
    actions: z.array(actions),
    weight_yes: z.number(),
    weight_no: z.number(),
    voters_count: z.number(),
    creation_tx_hash: z.string(),
    voting_period: z.number(),
  })
  .transform((data) => ({
    proposalId: data.proposal_id,
    onChainId: data.on_chain_id,
    description: data.description,
    creator: data.creator as Address,
    creatorEns: data.creator_ens,
    creatorLabel: data.creator_label,
    status: data.status,
    epoch: data.epoch,
    createdAt: toDate(data.created_at),
    end: new Date(
      toDate(data.created_at).getTime() + data.voting_period * 1000
    ),
    quorumWeight: data.quorum_weight,
    executionTx: data.execution_tx as Address | null,
    cancellationTx: data.cancellation_tx,
    actions: data.actions,
    weightYes: data.weight_yes,
    weightNo: data.weight_no,
    votersCount: data.voters_count,
    creationTxHash: data.creation_tx_hash as Address,
  }));

export const proposalsResponse = z
  .object({
    proposals: z.array(proposalData),
    page: z.number(),
    count: z.number(),
  })
  .transform((data) => ({
    proposals: data.proposals,
    page: data.page,
    count: data.count,
  }));

export const proposalResponse = proposalData;

const voteData = z
  .object({
    voter: z.string(),
    voter_ens: z.string().nullable(),
    voter_label: z.string().nullable(),
    weight_yes: z.number(),
    weight_no: z.number(),
    tx_hash: z.string(),
    timestamp: z.number(),
  })
  .transform((data) => ({
    voter: data.voter as Address,
    voterEns: data.voter_ens,
    voterLabel: data.voter_label,
    weightYes: data.weight_yes,
    weightNo: data.weight_no,
    txHash: data.tx_hash as Address,
    time: toDate(data.timestamp),
  }));

export const proposalVotesResponse = z
  .object({
    votes: z.array(voteData),
    total_votes: z.number(),
  })
  .transform((data) => ({
    votes: data.votes,
    totalVotes: data.total_votes,
  }));

export type ProposalsResponse = z.infer<typeof proposalsResponse>;
export type ProposalVotesResponse = z.infer<typeof proposalVotesResponse>;

export type Proposal = ProposalsResponse["proposals"][number];
export type ProposalStatus = Proposal["status"];
export type ProposalVote = ProposalVotesResponse["votes"][number];
