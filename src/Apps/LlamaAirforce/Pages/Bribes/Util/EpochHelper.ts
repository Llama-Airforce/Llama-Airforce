import { chain, isFinite } from "lodash";
import { notEmpty } from "@/Util";
import {
  type Delegation,
  type Proposal as SnapshotProposal,
  type Scores,
  type Vote,
} from "@LAF/Pages/Bribes/Rounds/Services/SnapshotService";
import type {
  Bribed,
  BribedPersonal,
  VoteDistribution,
  EpochId,
  Epoch,
  Proposal,
  ProposalId,
} from "@LAF/Pages/Bribes/Models";

export function totalAmountDollars(epoch: Epoch): number {
  return epoch.bribes.reduce((acc, cur) => acc + cur.amountDollars, 0);
}

export function totalAmountBribed(epoch: Epoch): number {
  return Object.entries(epoch.bribed).reduce((acc, [, cvx]) => acc + cvx, 0);
}

export function dollarPerVlAsset(epoch: Epoch): number {
  return totalAmountDollars(epoch) / totalAmountBribed(epoch);
}

export function getDateRaw(proposal: Proposal): Date {
  return new Date(proposal.end * 1000);
}

export function getDate(proposal: Proposal): string {
  return getDateRaw(proposal).toLocaleDateString();
}

export function getLink(epoch: EpochId, proposal: ProposalId): string {
  switch (epoch.protocol) {
    case "cvx-crv":
      return `https://vote.convexfinance.com/#/proposal/${proposal}`;
    case "aura-bal":
      return `https://snapshot.org/#/aurafinance.eth/proposal/${proposal}`;
    default:
      return "";
  }
}

/** Calculates by how much each pool got bribed by. */
export function getBribed(epoch: Epoch): Bribed[] {
  return Object.entries(epoch.bribed)
    .map(([pool, vlAsset]) => {
      // For each pool, find all the bribes and sum them.
      const bribesPool = epoch.bribes.filter((bribe) => bribe.pool === pool);
      const amount = bribesPool.reduce((acc, bribe) => acc + bribe.amount, 0);
      const amountDollars = bribesPool.reduce(
        (acc, bribe) => acc + bribe.amountDollars,
        0
      );

      return {
        pool,
        amount,
        amountDollars,
        dollarPerVlAsset: amountDollars / vlAsset,
      };
    })
    .filter(
      (x) =>
        isFinite(x.dollarPerVlAsset) &&
        x.amountDollars > 100 &&
        x.dollarPerVlAsset > 0 &&
        x.dollarPerVlAsset < 100
    );
}

/** Calculate by how much a voter got bribed by. */
export function getBribedPersonal(
  epoch: Epoch,
  distribution: VoteDistribution
): BribedPersonal[] {
  const poolsBribed = getBribed(epoch);

  return Object.entries(distribution)
    .map(([pool, allocation]) => {
      const bribed = poolsBribed.find((b) => b.pool === pool);
      if (!bribed) {
        return undefined;
      }

      return {
        pool: bribed.pool,
        dollarPerVlAsset: bribed.dollarPerVlAsset,
        amountDollars: bribed.dollarPerVlAsset * allocation.vlAsset,
        percentage: allocation.percentage,
      };
    })
    .filter((x): x is BribedPersonal => x !== undefined);
}

/**
 * Of delegates and a list of voters, find the one which counts.
 * The non-global one will have priority over the global one.
 */
export function prioritizeDelegates(
  delegations: Delegation[], // Global and space specific.
  voters: string[]
): Delegation[] {
  return chain(delegations)
    .filter(notEmpty)
    .filter((delegation) => voters.includes(delegation.delegate))
    .orderBy((d) => d.space, "desc")
    .uniqWith((x, y) => x.delegator === y.delegator)
    .value();
}

/** Calculate a user's voting distribution. */
export function getVoteDistribution(
  proposal: SnapshotProposal,
  voter: string,
  delegate: string | undefined,
  votes: Vote[],
  scores: Scores
): VoteDistribution {
  const distribution: VoteDistribution = {};

  // Check whether the user has voted.
  let vote = votes.find((vote) => vote.voter === voter);

  // If not, check if he has a delegator that voted.
  if (!vote && delegate) {
    vote = votes.find((vote) => vote.voter === delegate);
  }

  // If there's a vote by either the user or their delegator, calculate the distribution.
  if (vote) {
    const voteWeight = scores[0][voter] ?? 0; // The vlAsset balance of the voter.
    const voteTotal = Object.entries(vote.choice).reduce(
      (acc, [, allocation]) => acc + allocation,
      0
    );

    // Fix for the mim/mim-ust round 3 fuckup. Add mim votes to mim-ust pool.
    if (proposal.id === "QmaS9vd1vJKQNBYX4KWQ3nppsTT3QSL3nkz5ZYSwEJk6hZ") {
      vote.choice[52] = vote.choice[52] || 0 + vote.choice[41] || 0;
      vote.choice[41] = 0;

      // Delete if empty because otherwise it shows up in the loop below.
      if (vote.choice[52] === 0) delete vote.choice[52];
    }

    for (const [poolId, allocation] of Object.entries(vote.choice)) {
      const pool = proposal.choices[parseInt(poolId, 10) - 1];
      const scoreNormalized = allocation / voteTotal;
      const scoreWeighted = voteWeight * scoreNormalized;
      distribution[pool] = {
        vlAsset: scoreWeighted,
        percentage: scoreNormalized * 100,
      };
    }
  }

  return distribution;
}
