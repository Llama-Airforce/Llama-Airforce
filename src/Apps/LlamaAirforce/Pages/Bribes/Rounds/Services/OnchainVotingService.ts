import { formatUnits, zeroAddress } from "viem";
import type { PublicClient } from "viem";
import { abi as abiCvxLockerV2 } from "@/ABI/Convex/CvxLockerV2";
import { abi as abiGaugeDelegation } from "@/ABI/Convex/GaugeDelegation";
import { abi as abiGaugeVoteHelper } from "@/ABI/Convex/GaugeVoteHelper";
import { abi as abiGaugeVotePlatform } from "@/ABI/Convex/GaugeVotePlatform";
import type { Address } from "@/types/address";
import { chunk } from "@/Utils/Array";
import {
  ConvexCurveGaugeVotingAddress,
  ConvexFxGaugeVotingAddress,
  ConvexGaugeDelegationAddress,
  ConvexGaugeVoteHelperAddress,
  VlCvxAddress,
} from "@/Utils/Addresses";
import type {
  Epoch,
  ProposalId,
  Protocol,
  VoteDistribution,
} from "@LAF/Pages/Bribes/Models";
import { getVotiumRoundTimestamp } from "@LAF/Pages/Bribes/Util/VoteSource";

export type OnchainVotingProtocol = Extract<Protocol, "cvx-crv" | "cvx-fxn">;

const UNKNOWN_POOL_IDS = new Set([
  "0x0",
  "0x0000000000000000000000000000000000000000",
]);

export type OnchainProposal = {
  id: ProposalId;
  start: number;
  end: number;
  epoch: bigint;
  snapshot: string;
  choices: string[];
};

export type OnchainVote = {
  voter: Address;
  gauges: Address[];
  weights: bigint[];
  voted: boolean;
  baseWeight: bigint;
  adjustedWeight: bigint;
  effectiveWeight: bigint;
};

export type OnchainMemberDistribution = {
  member: Address;
  voteAddress: Address;
  delegate?: Address;
  vlAsset: number;
  distribution: VoteDistribution;
};

const PAGE_SIZE = 100;

type RawProposal = readonly [number | bigint, number | bigint, number | bigint];
type RawVote = readonly [
  readonly string[],
  readonly bigint[],
  boolean,
  bigint,
  bigint,
];

export function isOnchainVotingProtocol(
  protocol: Protocol
): protocol is OnchainVotingProtocol {
  return protocol === "cvx-crv" || protocol === "cvx-fxn";
}

export function getOnchainGaugeVotingAddress(
  protocol: OnchainVotingProtocol
): Address {
  switch (protocol) {
    case "cvx-crv":
      return ConvexCurveGaugeVotingAddress;
    case "cvx-fxn":
      return ConvexFxGaugeVotingAddress;
  }
}

export default class OnchainVotingService {
  public constructor(private readonly client: PublicClient) {}

  public async getProposal(
    protocol: OnchainVotingProtocol,
    proposalId: ProposalId
  ): Promise<OnchainProposal> {
    const proposalIndex = toProposalIndex(proposalId);
    const [startTime, endTime, epoch] = (await this.client.readContract({
      address: getOnchainGaugeVotingAddress(protocol),
      abi: abiGaugeVotePlatform,
      functionName: "proposals",
      args: [proposalIndex],
    })) as RawProposal;
    const epochBigInt = BigInt(epoch);

    return {
      id: proposalId,
      start: Number(startTime),
      end: Number(endTime),
      epoch: epochBigInt,
      snapshot: epochBigInt.toString(),
      choices: [],
    };
  }

  public async isFinalized(
    protocol: OnchainVotingProtocol,
    proposalId: ProposalId
  ): Promise<boolean> {
    return this.client.readContract({
      address: getOnchainGaugeVotingAddress(protocol),
      abi: abiGaugeVotePlatform,
      functionName: "isFinalized",
      args: [toProposalIndex(proposalId)],
    });
  }

  public async validateProposal(
    protocol: OnchainVotingProtocol,
    round: number,
    proposal: OnchainProposal,
    sourceRound = round
  ): Promise<OnchainProposal> {
    const roundLabel =
      round === sourceRound
        ? `round ${round}`
        : `round ${round} (Votium round ${sourceRound})`;

    if (proposal.end === 0) {
      throw new Error(
        `On-chain voting proposal ${proposal.id} for ${protocol} ${roundLabel} is empty or force-ended`
      );
    }

    const expectedEpoch = await this.client.readContract({
      address: VlCvxAddress,
      abi: abiCvxLockerV2,
      functionName: "findEpochId",
      args: [BigInt(getVotiumRoundTimestamp(protocol, sourceRound))],
    });

    const previousExpectedEpoch = expectedEpoch - 1n;
    if (
      proposal.epoch !== expectedEpoch &&
      proposal.epoch !== previousExpectedEpoch
    ) {
      throw new Error(
        `On-chain voting proposal ${proposal.id} for ${protocol} ${roundLabel} has vlCVX epoch ${proposal.epoch}, expected ${expectedEpoch} or ${previousExpectedEpoch}`
      );
    }

    const isFinalized = await this.isFinalized(protocol, proposal.id);
    if (!isFinalized) {
      throw new Error(
        `On-chain voting proposal ${proposal.id} for ${protocol} ${roundLabel} is not finalized`
      );
    }

    return proposal;
  }

  public async getVoters(
    protocol: OnchainVotingProtocol,
    proposalId: ProposalId
  ): Promise<Address[]> {
    const proposalIndex = toProposalIndex(proposalId);
    const votingAddress = getOnchainGaugeVotingAddress(protocol);
    const voterCount = await this.client.readContract({
      address: votingAddress,
      abi: abiGaugeVotePlatform,
      functionName: "getVoterCount",
      args: [proposalIndex],
    });

    const indices = Array.from({ length: Number(voterCount) }, (_, i) =>
      BigInt(i)
    );
    const voterChunks = await Promise.all(
      chunk(indices, PAGE_SIZE).map(async (indicesChunk) => {
        const results = (await this.client.multicall({
          allowFailure: false,
          contracts: indicesChunk.map((index) => ({
            address: votingAddress,
            abi: abiGaugeVotePlatform,
            functionName: "getVoterAtIndex",
            args: [proposalIndex, index],
          })),
        })) as unknown as readonly string[];

        return results.map((address) => toAddress(address));
      })
    );

    return voterChunks.flat();
  }

  public async getVotes(
    protocol: OnchainVotingProtocol,
    proposalId: ProposalId,
    voters: Address[]
  ): Promise<Record<Address, OnchainVote>> {
    const proposalIndex = toProposalIndex(proposalId);
    const votingAddress = getOnchainGaugeVotingAddress(protocol);
    const voteChunks = await Promise.all(
      chunk(voters, PAGE_SIZE).map(async (votersChunk) => {
        const results = (await this.client.multicall({
          allowFailure: false,
          contracts: votersChunk.map((voter) => ({
            address: votingAddress,
            abi: abiGaugeVotePlatform,
            functionName: "getVote",
            args: [proposalIndex, voter],
          })),
        })) as unknown as readonly RawVote[];

        return votersChunk.reduce<Record<Address, OnchainVote>>(
          (acc, voter, i) => {
            const [gauges, weights, voted, baseWeight, adjustedWeight] =
              results[i];
            acc[voter] = {
              voter,
              gauges: gauges.map((gauge) => toAddress(gauge)),
              weights: [...weights],
              voted,
              baseWeight,
              adjustedWeight,
              effectiveWeight: baseWeight + adjustedWeight,
            };

            return acc;
          },
          {}
        );
      })
    );

    return Object.assign({}, ...voteChunks) as Record<Address, OnchainVote>;
  }

  public async getDelegatesAtEpoch(
    users: Address[],
    epoch: bigint
  ): Promise<Record<Address, Address | undefined>> {
    const delegateChunks = await Promise.all(
      chunk(users, PAGE_SIZE).map(async (usersChunk) => {
        const results = (await this.client.multicall({
          allowFailure: false,
          contracts: usersChunk.map((user) => ({
            address: ConvexGaugeDelegationAddress as Address,
            abi: abiGaugeDelegation,
            functionName: "getDelegateAtEpoch",
            args: [user, epoch],
          })),
        })) as readonly string[];

        return usersChunk.reduce<Record<Address, Address | undefined>>(
          (acc, user, i) => {
            const delegate = toAddress(results[i]);
            acc[user] =
              delegate === zeroAddress.toLowerCase() ? undefined : delegate;

            return acc;
          },
          {}
        );
      })
    );

    return Object.assign({}, ...delegateChunks) as Record<
      Address,
      Address | undefined
    >;
  }

  public async getContributingWeights(
    protocol: OnchainVotingProtocol,
    proposalId: ProposalId,
    delegate: Address,
    users: Address[]
  ): Promise<Record<Address, bigint>> {
    const proposalIndex = toProposalIndex(proposalId);
    const votingAddress = getOnchainGaugeVotingAddress(protocol);
    const weightChunks = await Promise.all(
      chunk(users, PAGE_SIZE).map(async (usersChunk) => {
        const results = await this.client.readContract({
          address: ConvexGaugeVoteHelperAddress,
          abi: abiGaugeVoteHelper,
          functionName: "getContributingWeights",
          args: [proposalIndex, delegate, usersChunk, votingAddress],
        });

        return usersChunk.reduce<Record<Address, bigint>>((acc, user, i) => {
          acc[user] = results[i];

          return acc;
        }, {});
      })
    );

    return Object.assign({}, ...weightChunks) as Record<Address, bigint>;
  }

  public async getMemberDistribution(
    protocol: OnchainVotingProtocol,
    epoch: Epoch,
    member: Address
  ): Promise<OnchainMemberDistribution | undefined> {
    const proposal = await this.getProposal(protocol, epoch.proposal);
    await this.validateProposal(
      protocol,
      epoch.round,
      proposal,
      epoch.sourceRound ?? epoch.round
    );
    const directVotes = await this.getVotes(protocol, epoch.proposal, [member]);
    const directVote = directVotes[member];
    if (directVote.voted && directVote.baseWeight > 0n) {
      return toMemberDistribution(epoch, member, member, directVote.baseWeight, directVote);
    }

    const delegates = await this.getDelegatesAtEpoch([member], proposal.epoch);
    const delegate = delegates[member];
    if (!delegate) {
      return undefined;
    }

    const delegateVotes = await this.getVotes(protocol, epoch.proposal, [
      delegate,
    ]);
    const delegateVote = delegateVotes[delegate];
    if (!delegateVote.voted) {
      return undefined;
    }

    const weights = await this.getContributingWeights(
      protocol,
      epoch.proposal,
      delegate,
      [member]
    );
    const memberWeight = weights[member];
    if (!memberWeight || memberWeight <= 0n) {
      return undefined;
    }

    return toMemberDistribution(epoch, member, delegate, memberWeight, delegateVote);
  }

  public async getMemberDistributions(
    protocol: OnchainVotingProtocol,
    epoch: Epoch,
    members: Address[]
  ): Promise<OnchainMemberDistribution[]> {
    const proposal = await this.getProposal(protocol, epoch.proposal);
    await this.validateProposal(
      protocol,
      epoch.round,
      proposal,
      epoch.sourceRound ?? epoch.round
    );
    const directVotes = await this.getVotes(protocol, epoch.proposal, members);
    const distributions: OnchainMemberDistribution[] = [];
    const delegatedMembers: Address[] = [];

    for (const member of members) {
      const vote = directVotes[member];
      if (vote.voted && vote.baseWeight > 0n) {
        distributions.push(
          toMemberDistribution(epoch, member, member, vote.baseWeight, vote)
        );
      } else {
        delegatedMembers.push(member);
      }
    }

    const delegates = await this.getDelegatesAtEpoch(
      delegatedMembers,
      proposal.epoch
    );
    const delegateGroups = delegatedMembers.reduce<Record<Address, Address[]>>(
      (acc, member) => {
        const delegate = delegates[member];
        if (!delegate) {
          return acc;
        }

        acc[delegate] = [...(acc[delegate] ?? []), member];
        return acc;
      },
      {}
    );
    const delegateVotes = await this.getVotes(
      protocol,
      epoch.proposal,
      Object.keys(delegateGroups) as Address[]
    );

    const delegatedDistributions = await Promise.all(
      (Object.entries(delegateGroups) as [Address, Address[]][]).map(
        async ([delegate, users]) => {
          const delegateVote = delegateVotes[delegate];
          if (!delegateVote.voted) {
            return [];
          }

          const weights = await this.getContributingWeights(
            protocol,
            epoch.proposal,
            delegate,
            users
          );

          return users
            .map((member) => {
              const memberWeight = weights[member];
              if (!memberWeight || memberWeight <= 0n) {
                return undefined;
              }

              return toMemberDistribution(
                epoch,
                member,
                delegate,
                memberWeight,
                delegateVote
              );
            })
            .filter((distribution) => distribution !== undefined);
        }
      )
    );

    return [...distributions, ...delegatedDistributions.flat()];
  }
}

function toProposalIndex(proposalId: ProposalId): bigint {
  if (!/^\d+$/.test(proposalId)) {
    throw new Error(`On-chain proposal id must be numeric: ${proposalId}`);
  }

  return BigInt(proposalId);
}

function toAddress(address: string): Address {
  return address.toLowerCase() as Address;
}

function toMemberDistribution(
  epoch: Epoch,
  member: Address,
  voteAddress: Address,
  memberWeight: bigint,
  vote: OnchainVote
): OnchainMemberDistribution {
  const distribution = getVoteDistribution(epoch, memberWeight, vote);
  const vlAsset = toVlAsset(memberWeight);

  return {
    member,
    voteAddress,
    delegate: voteAddress === member ? undefined : voteAddress,
    vlAsset,
    distribution,
  };
}

export function getVoteDistribution(
  epoch: Pick<Epoch, "bribes">,
  memberWeight: bigint,
  vote: Pick<OnchainVote, "gauges" | "weights">
): VoteDistribution {
  const distribution: VoteDistribution = {};
  const totalWeight = vote.weights.reduce((acc, weight) => acc + weight, 0n);
  if (totalWeight <= 0n || memberWeight <= 0n) {
    return distribution;
  }

  const poolByGauge = getPoolByGauge(epoch);

  for (let i = 0; i < vote.gauges.length; i++) {
    const gauge = vote.gauges[i].toLowerCase();
    const pool = poolByGauge[gauge];
    if (!pool) {
      continue;
    }

    const percentage = Number(vote.weights[i]) / Number(totalWeight);
    const vlAsset = toVlAsset(memberWeight) * percentage;

    if (!(pool in distribution)) {
      distribution[pool] = { vlAsset: 0, percentage: 0 };
    }

    distribution[pool].vlAsset += vlAsset;
    distribution[pool].percentage += percentage * 100;
  }

  return distribution;
}

function getPoolByGauge(epoch: Pick<Epoch, "bribes">): Record<string, string> {
  return Object.fromEntries(
    epoch.bribes
      .filter((bribe) => bribe.gauge && !isUnknownPool(bribe.pool))
      .map((bribe) => [bribe.gauge!.toLowerCase(), bribe.pool])
  );
}

function isUnknownPool(pool: string): boolean {
  return UNKNOWN_POOL_IDS.has(pool.toLowerCase());
}

function toVlAsset(weight: bigint): number {
  return Number(formatUnits(weight, 18));
}
