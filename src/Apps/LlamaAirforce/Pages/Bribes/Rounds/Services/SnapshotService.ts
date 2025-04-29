import { getAddress } from "viem";
import { ServiceBaseHost } from "@/Services";
import type { Address } from "@/types/address";
import { mapKeys } from "@/Utils/Object";
import { paginate } from "@/Utils/Pagination";
import type { ProposalId, Protocol } from "@LAF/Pages/Bribes/Models";
import type { Result as DelegationsResponse } from "@LAF/Server/routes/delegations.post";

const SNAPSHOT_URL = "https://hub.snapshot.org/graphql";
const SNAPSHOT_SCORE_URL = "https://score.snapshot.org/api/scores";

export type Proposal = {
  id: ProposalId;
  snapshot: string;
  choices: string[];
  end: number;
};

export type Delegation = {
  id: string;

  /** The one who votes on behalf of someone. */
  delegate: Address;

  /** The one who let somebody else use their voting power. */
  delegator: Address;

  timestamp: number;
  space: string;
};

export type Vote = {
  id: string;
  voter: Address;
  choice: Record<string, number>;
};

export type Scores = Record<Address, number>[];

export default class SnapshotService extends ServiceBaseHost {
  public async getProposal(proposalId: ProposalId): Promise<Proposal> {
    const query = `{
            proposal(id: "${proposalId}") {
                id
                snapshot
                choices
                end
            } }`;

    return this.fetch<{
      data: {
        proposal: Proposal;
      };
    }>(SNAPSHOT_URL, { query }).then((resp) => resp.data.proposal);
  }

  public getDelegations(
    block: number,
    options: {
      delegators?: string[];
      delegates?: string[];
      space: string;
    }
  ): Promise<Delegation[]> {
    const delegatorIn =
      options.delegators && options.delegators.length > 0
        ? `delegator_in: ${JSON.stringify(options.delegators)}`
        : "";

    const delegateIn =
      options.delegates && options.delegates.length > 0
        ? `delegate_in: ${JSON.stringify(options.delegates)}`
        : "";

    const spaces = ["", options.space];
    const spaceIn = `space_in: ${JSON.stringify(spaces)}`;

    let timestampLast = 0;

    const fs = async (_page: number, offset: number) => {
      const body = {
        block,
        timestampLast,
        spaceIn,
        delegateIn,
        delegatorIn,
        offset,
      };

      const host = await this.getHost();
      const resp = await this.fetch<DelegationsResponse>(
        `${host}/delegations`,
        body
      );

      const delegations = resp.data.delegations;

      timestampLast = Math.max(...delegations.map((d) => d.timestamp));

      return delegations.map((delegation) => {
        delegation.delegate =
          delegation.delegate.toLocaleLowerCase() as Address;
        delegation.delegator =
          delegation.delegator.toLocaleLowerCase() as Address;

        return delegation;
      });
    };

    // Because we filter on timestamp_gte, we might end with duplicates.
    function unique(
      value: Delegation,
      index: number,
      self: Delegation[]
    ): boolean {
      return self.map((d) => d.id).indexOf(value.id) === index;
    }

    return paginate(fs).then((delegations) => delegations.filter(unique));
  }

  public async getVotes(
    proposal: ProposalId,
    voters: string[] = []
  ): Promise<Vote[]> {
    const votersChecksummed = voters.map((x) => getAddress(x));
    const voterIn =
      voters.length > 0 ? `voter_in: ${JSON.stringify(votersChecksummed)}` : "";

    const fs = (page: number, offset: number) => {
      const query = `{
                votes(
                    where: {
                        proposal: "${proposal}",
                        ${voterIn}
                    },
                    first: ${offset}
                    skip: ${page * offset}
                    orderBy: "created"
                    orderDirection: desc
                ) {
                    id
                    voter
                    choice
                } }`;

      return this.fetch<{
        data: {
          votes: Vote[];
        };
      }>(SNAPSHOT_URL, { query }).then((resp) =>
        resp.data.votes.map((vote) => {
          vote.voter = vote.voter.toLocaleLowerCase() as Address;

          return vote;
        })
      );
    };

    return paginate(fs)
      .then((votes) => {
        /*
         * Fix for HiddenHand fucking up their vote in Aura round 21.
         * It was added later manually, hence we hardcode this vote in.
         * https://snapshot.org/#/aurafinance.eth/proposal/0x051e501623ca3f97d1131b04ae55201ed0f4226c523ac9acebc96a7c4c5c823d
         */
        const hardcodeHHVote =
          proposal ===
            "0xdf8a01486bd5e3a8c11b161f2a43f7295b0cd4ff257d5de95e485512287157b3" &&
          voters.includes("0x3cde8fa1c73afe0828f672d197e082463c2ac8e2");

        if (hardcodeHHVote) {
          votes.push(HH_VOTE);
        }

        return votes;
      })
      .then(async (votes) => {
        /**
         * Fix for Curve API fucking up which resulted in the proposal missing all sidechain gauges
         * Tommy was able to snapshot the old vote and we going to try and aggregate back in the old and the new.
         * Basically the way we're doing it, when we grab the votes from snapshot they are in this format (but an array).
         * So just cycling through this list and if the voter is not in the results,
         * their entry gets pushed into the votes before checking scores
         */
        if (
          proposal !==
          "0x3016b4856269e94064a8ddd5bd6d229a03f08471c011b6fa4ddbccd225b4e6aa"
        ) {
          return votes;
        }

        console.log(
          "HOTFIX: round 95 of cvxcrv, patching in hardcoded votes from deleted proposal"
        );
        const { votes: votesOld } = await import("../Hotfix/crv-95");

        const oldVotesArray = Object.values(votesOld);
        console.log(
          `Adding ${oldVotesArray.length} hardcoded votes from deleted proposal`
        );

        // Create a map of existing voters for quick lookup
        const existingVoters = new Set(
          votes.map((vote) => vote.voter.toLowerCase())
        );

        // Add votes from old proposal that aren't already in the current votes
        let count = 0;
        for (const oldVote of oldVotesArray) {
          const voterAddress = oldVote.voter.toLowerCase() as Address;
          if (!existingVoters.has(voterAddress)) {
            count++;
            votes.push({
              id: oldVote.id,
              voter: voterAddress,
              choice: oldVote.choice,
            });
          }
        }

        console.log(`Replaced ${count} votes`);

        return votes;
      });
  }

  public async getScores(
    protocol: Protocol,
    snapshot: number,
    voters: Address[]
  ): Promise<Scores> {
    switch (protocol) {
      case "cvx-crv":
        return await this.getScoresCvx(snapshot, voters);
      case "cvx-prisma":
        return await this.getScoresCvx(snapshot, voters); // Re-uses existing CVX infra?
      case "cvx-fxn":
        return await this.getScoresCvx(snapshot, voters); // Re-uses existing CVX infra?
      case "aura-bal":
        return await this.getScoresAura(snapshot, voters);
    }
  }

  public async getScoresCvx(
    snapshot: number,
    voters: Address[]
  ): Promise<Scores> {
    const address =
      snapshot >= 13948583
        ? snapshot >= 14400650
          ? snapshot >= 15091880
            ? "0x81768695e9fdda232491bec5b21fd1bc1116f917"
            : "0x1cc2CFed7e40bAb890Ca532AD0DBB413e072b988"
          : "0x59CcBAABBFCAC52E007A706242C5B81a48179BF2"
        : "0xD18140b4B819b895A3dba5442F959fA44994AF50";

    const strategies = [
      {
        name: "erc20-balance-of",
        params: {
          symbol: "CVX",
          address,
          decimals: 18,
        },
      },
    ];

    const params = {
      space: "cvx.eth",
      network: "1",
      snapshot,
      strategies,
      addresses: voters,
    };

    return this.fetch<{
      result: {
        scores: Scores;
      };
    }>(SNAPSHOT_SCORE_URL, { params }).then((resp) =>
      resp.result.scores.map((scores) =>
        mapKeys(scores, (_, key) => key.toLocaleLowerCase())
      )
    );
  }

  public async getScoresAura(
    snapshot: number,
    voters: Address[]
  ): Promise<Scores> {
    const space =
      snapshot >= 16438041 ? "gauges.aurafinance.eth" : "aurafinance.eth";

    const address = "0x3Fa73f1E5d8A792C80F426fc8F84FBF7Ce9bBCAC";

    const strategies = [
      {
        name: "erc20-votes-with-override",
        params: {
          symbol: "vlAURA",
          address,
          decimals: 18,
        },
      },
    ];

    const params = {
      space,
      network: "1",
      snapshot,
      strategies,
      addresses: voters,
    };

    return this.fetch<{
      result: {
        scores: Scores;
      };
    }>(SNAPSHOT_SCORE_URL, { params }).then((resp) =>
      resp.result.scores.map((scores) =>
        mapKeys(scores, (_, key) => key.toLocaleLowerCase())
      )
    );
  }
}

const HH_VOTE: Vote = {
  id: "",
  voter: "0x3cde8fa1c73afe0828f672d197e082463c2ac8e2",
  choice: {
    "34": 1003664,
    "10": 797362,
    "3": 735059,
    "50": 595202,
    "41": 505444,
    "30": 178861,
    "46": 153029,
    "39": 132059,
    "63": 130284,
    "57": 115001,
    "12": 114928,
    "42": 97179,
    "2": 87768,
    "52": 78816,
    "62": 72466,
    "51": 66378,
    "53": 50156,
    "72": 41716,
    "58": 37209,
    "49": 33585,
    "75": 29596,
    "74": 29376,
    "25": 26741,
    "69": 24724,
    "29": 24521,
    "73": 23503,
    "77": 20734,
    "78": 13528,
    "66": 10177,
    "54": 9735,
    "86": 8117,
    "56": 6892,
  },
};
