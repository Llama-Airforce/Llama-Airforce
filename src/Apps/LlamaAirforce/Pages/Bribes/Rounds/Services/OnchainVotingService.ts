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
  VlCvxAddress
} from "@/Utils/Addresses";
import type {
  Epoch,
  ProposalId,
  Protocol,
  VoteDistribution
} from "@LAF/Pages/Bribes/Models";

export type OnchainVotingProtocol = Extract<Protocol, "cvx-crv" | "cvx-fxn">;

const UNKNOWN_POOL_IDS = new Set([
  "0x0",
  "0x0000000000000000000000000000000000000000"
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

/** A single vote a member's weight ended up in. */
export type OnchainDistributionLeg = {
  /** The address whose gauge choices were used: the member or their delegate. */
  voteAddress: Address;
  weight: bigint;
  distribution: VoteDistribution;
};

export type OnchainMemberDistribution = {
  member: Address;
  /** The member when they cast their own vote, their delegate otherwise. */
  voteAddress: Address;
  /** Set whenever part of the member's weight was used by their delegate's vote. */
  delegate?: Address;
  vlAsset: number;
  distribution: VoteDistribution;
  /** Two legs when the member's weight is split over their own and their delegate's vote. */
  legs: OnchainDistributionLeg[];
};

type DelegatedContribution = {
  member: Address;
  delegate: Address;
  vote: OnchainVote;
  weight: bigint;
};

const PAGE_SIZE = 100;

type RawProposal = readonly [number | bigint, number | bigint, number | bigint];
type RawVote = readonly [
  readonly string[],
  readonly bigint[],
  boolean,
  bigint,
  bigint
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

type ConvexOnchainProtocol = Extract<Protocol, "cvx-crv" | "cvx-fxn">;
const VOTIUM_EPOCH_SECONDS = 86400 * 14;
const VOTIUM_CVX_CRV_FIRST_CURVE_EPOCH = 1348;
const VOTIUM_CVX_FXN_CURVE_EPOCH_OFFSET = 65;

export function getVotiumRoundTimestamp(
  protocol: ConvexOnchainProtocol,
  round: number
): number {
  const curveEpoch =
    VOTIUM_CVX_CRV_FIRST_CURVE_EPOCH +
    round +
    (protocol === "cvx-fxn" ? VOTIUM_CVX_FXN_CURVE_EPOCH_OFFSET : 0);

  return curveEpoch * VOTIUM_EPOCH_SECONDS;
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
      args: [proposalIndex]
    })) as RawProposal;
    const epochBigInt = BigInt(epoch);

    return {
      id: proposalId,
      start: Number(startTime),
      end: Number(endTime),
      epoch: epochBigInt,
      snapshot: epochBigInt.toString(),
      choices: []
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
      args: [toProposalIndex(proposalId)]
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
      args: [BigInt(getVotiumRoundTimestamp(protocol, sourceRound))]
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
      args: [proposalIndex]
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
            args: [proposalIndex, index]
          }))
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
            args: [proposalIndex, voter]
          }))
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
              effectiveWeight: baseWeight + adjustedWeight
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
            args: [user, epoch]
          }))
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
          args: [proposalIndex, delegate, usersChunk, votingAddress]
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
    const [distribution] = await this.getMemberDistributions(protocol, epoch, [
      member
    ]);

    return distribution;
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

    /*
     * Delegated weight is looked up for every member, including members that cast
     * a vote themselves. Relocking an expired lock and syncing mid-round splits a
     * member's weight between their own vote (the weight recorded when they voted)
     * and their delegate's vote (the synced delta), so treating the two as mutually
     * exclusive silently drops the delta.
     */
    const delegates = await this.getDelegatesAtEpoch(members, proposal.epoch);
    const delegateGroups = members.reduce<Record<Address, Address[]>>(
      (acc, member) => {
        const delegate = delegates[member];
        if (!delegate || delegate === member) {
          return acc;
        }

        acc[delegate] = [...(acc[delegate] ?? []), member];
        return acc;
      },
      {}
    );

    const delegateAddresses = Object.keys(delegateGroups) as Address[];
    const votes = await this.getVotes(protocol, epoch.proposal, [
      ...new Set([...members, ...delegateAddresses])
    ]);

    const contributions = await Promise.all(
      (Object.entries(delegateGroups) as [Address, Address[]][]).map(
        async ([delegate, users]) => {
          /*
           * getContributingWeights reports a delegator's full weight when the
           * delegate never voted, so the delegate's vote has to be checked here.
           */
          const delegateVote = votes[delegate];
          if (!delegateVote.voted) {
            return [];
          }

          const weights = await this.getContributingWeights(
            protocol,
            epoch.proposal,
            delegate,
            users
          );

          return users.map<DelegatedContribution>((member) => ({
            member,
            delegate,
            vote: delegateVote,
            weight: weights[member] ?? 0n
          }));
        }
      )
    );

    const contributionByMember = Object.assign(
      {},
      ...contributions
        .flat()
        .map((contribution) => ({ [contribution.member]: contribution }))
    ) as Record<Address, DelegatedContribution | undefined>;

    return members
      .map((member) =>
        toMemberDistribution(
          epoch,
          member,
          votes[member],
          contributionByMember[member]
        )
      )
      .filter((distribution) => distribution !== undefined);
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
  ownVote: OnchainVote | undefined,
  contribution: DelegatedContribution | undefined
): OnchainMemberDistribution | undefined {
  const legs: OnchainDistributionLeg[] = [];

  /*
   * Only the member's own locked weight (baseWeight); weight delegated to them
   * (adjustedWeight) is claimed by their delegators through getContributingWeights.
   */
  if (ownVote?.voted && ownVote.baseWeight > 0n) {
    legs.push(toDistributionLeg(epoch, member, ownVote.baseWeight, ownVote));
  }

  let delegate: Address | undefined;
  if (contribution && contribution.weight > 0n) {
    delegate = contribution.delegate;
    legs.push(
      toDistributionLeg(epoch, delegate, contribution.weight, contribution.vote)
    );
  }

  if (legs.length === 0) {
    return undefined;
  }

  const weight = legs.reduce((acc, leg) => acc + leg.weight, 0n);

  return {
    member,
    voteAddress: legs[0].voteAddress,
    delegate,
    vlAsset: toVlAsset(weight),
    distribution: mergeDistributions(legs, weight),
    legs
  };
}

function toDistributionLeg(
  epoch: Pick<Epoch, "bribes">,
  voteAddress: Address,
  weight: bigint,
  vote: OnchainVote
): OnchainDistributionLeg {
  return {
    voteAddress,
    weight,
    distribution: getVoteDistribution(epoch, weight, vote)
  };
}

function mergeDistributions(
  legs: OnchainDistributionLeg[],
  totalWeight: bigint
): VoteDistribution {
  const merged: VoteDistribution = {};

  for (const leg of legs) {
    // Percentages are relative to a leg's own weight, so rescale to the total.
    const share = Number(leg.weight) / Number(totalWeight);

    for (const [pool, allocation] of Object.entries(leg.distribution)) {
      if (!(pool in merged)) {
        merged[pool] = { vlAsset: 0, percentage: 0 };
      }

      merged[pool].vlAsset += allocation.vlAsset;
      merged[pool].percentage += allocation.percentage * share;
    }
  }

  return merged;
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
