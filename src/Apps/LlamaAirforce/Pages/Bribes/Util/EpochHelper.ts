import { zip } from "lodash";
import {
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
import { type StateUser } from "@LAF/Pages/Bribes/Rounds/Services/L2VotingService";

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
    case "cvx-prisma":
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
      const amount = bribesPool.map((bribe) => bribe.amount);
      const amountDollars = bribesPool.map((bribe) => bribe.amountDollars);
      const amountDollarsTotal = bribesPool.reduce(
        (acc, bribe) => acc + bribe.amountDollars,
        0
      );
      const maxPerVote = bribesPool.map((bribe) => bribe.maxPerVote ?? 0);
      const dollarPerVlAsset = amountDollarsTotal / vlAsset;

      return {
        pool,
        vlAsset,
        amount,
        amountDollars,
        amountDollarsTotal,
        maxPerVote,
        dollarPerVlAsset,
      };
    })
    .filter(
      (x) =>
        isFinite(x.dollarPerVlAsset) &&
        x.amountDollarsTotal > 100 &&
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

      /**
       * Example:
       * If total bribes were 600 FXS ($3600) and 200 vlCVX voted for it,
       * then Math.min(maxPerVote, totalTokenAmount / totalCVX) would be Math.min(maxPerVote, 3)
       * which with maxPerVote = 0.5 would reduce to 0.5 FXS per vlCVX.
       *
       * So if I voted with 50 vlCVX, I'd get 0.5 * 50 = 25 FXS. Now the total bribe amount was 600 FXS ($3600),
       * so the price is $3600/600 = $6 per FXS, so my final dollar amount is $6 * 25 = $150.
       */
      const amountDollarsPerBribed = zip(
        bribed.amount,
        bribed.amountDollars,
        bribed.maxPerVote
      ).map(([amount_, amountDollars_, maxPerVote_]) => {
        if (
          amount_ === undefined ||
          amountDollars_ === undefined ||
          maxPerVote_ === undefined
        ) {
          return 0;
        }

        const tokenPrice = amountDollars_ / amount_;
        let amountPerVlAsset = amount_ / bribed.vlAsset;
        if (maxPerVote_) {
          amountPerVlAsset = Math.min(maxPerVote_, amountPerVlAsset);
        }

        const amount = amountPerVlAsset * allocation.vlAsset;
        const amountDollars = amount * tokenPrice;

        return amountDollars;
      });

      const amountDollars = amountDollarsPerBribed.reduce(
        (acc, cur) => acc + cur,
        0
      );

      const vlAsset = distribution[bribed.pool].vlAsset;
      const dollarPerVlAsset = amountDollars / vlAsset;

      return {
        pool: bribed.pool,
        dollarPerVlAsset,
        amountDollars,
        percentage: allocation.percentage,
      };
    })
    .filter((x): x is BribedPersonal => x !== undefined);
}

/** Calculate a user's voting distribution. */
export function getVoteDistributionSnapshot(
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

/** Calculate a user's voting distribution, assuming a final state where each vote is applied. */
export function getVoteDistributionL2(
  epoch: Epoch,
  user: StateUser
): VoteDistribution {
  const distribution: VoteDistribution = {};

  // Only bother with users that have either voted or whose delegator has voted.
  if (user.gauges.length === 0) {
    return distribution;
  }

  const voteWeight = Number(user.score) / 10 ** 18; // The vlAsset balance of the voter.
  const voteTotal = user.weights.reduce((acc, x) => acc + Number(x), 0);

  for (const [gauge, weight] of zip(user.gauges, user.weights)) {
    const pool = epoch.bribes.find((bribe) => bribe.gauge === gauge)?.pool;
    if (!pool) {
      throw new Error(`Pool not found for gauge ${gauge}`);
    }

    const scoreNormalized = Number(weight) / voteTotal;
    const scoreWeighted = voteWeight * scoreNormalized;

    distribution[pool] = {
      vlAsset: scoreWeighted,
      percentage: scoreNormalized * 100,
    };
  }

  return distribution;
}
