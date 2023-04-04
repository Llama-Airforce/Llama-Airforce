import { mapKeys } from "lodash";
import { paginate } from "@/Util";
import type { ProposalId, Protocol } from "@/Pages/Bribes/Models";
import ServiceBase from "@/Services/ServiceBase";

const SNAPSHOT_URL = "https://hub.snapshot.org/graphql";
const SNAPSHOT_SCORE_URL = "https://score.snapshot.org/api/scores";
const SNAPSHOT_THEGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot";

export class Proposal {
  id: ProposalId;
  snapshot: string;
  choices: Record<string, number>;
  end: number;
}

export class GetProposalResponse {
  data: {
    proposal: Proposal;
  };
}

export class Delegation {
  id: string;

  /** The one who votes on behalf of someone. */
  delegate: string;

  /** The one who let somebody else use their voting power. */
  delegator: string;

  timestamp: number;
  space: string;
}

export class GetDelegatorsResponse {
  data: {
    delegations: Delegation[];
  };
}

export class Vote {
  id: string;
  voter: string;
  choice: Record<string, number>;
}

export class GetVotesResponse {
  data: {
    votes: Vote[];
  };
}

export type Scores = Record<string, number>[];

export class GetScoresResponse {
  result: {
    scores: Scores;
  };
}

export default class SnapshotService extends ServiceBase {
  public async getProposal(proposalId: ProposalId): Promise<Proposal> {
    const query = `{
            proposal(id: "${proposalId}") {
                id
                snapshot
                choices
                end
            } }`;

    return this.fetch(SNAPSHOT_URL, GetProposalResponse, { query }).then(
      (resp) => resp.data.proposal
    );
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
      const query = `{
            delegations (
              where: {
                timestamp_gte: ${timestampLast}
                ${spaceIn}
                ${delegateIn}
                ${delegatorIn}
              },
              first: ${offset}
              block: {
                number: ${block}
              }
              orderBy: timestamp
              orderDirection: asc
            ) {
                id
                timestamp
                delegate
                delegator
                space
            } }`;

      const resp = await this.fetch(
        SNAPSHOT_THEGRAPH_URL,
        GetDelegatorsResponse,
        {
          query,
        }
      );

      const delegations = resp.data.delegations;

      timestampLast = Math.max(...delegations.map((d) => d.timestamp));

      return delegations.map((delegation) => {
        delegation.delegate = delegation.delegate.toLocaleLowerCase();
        delegation.delegator = delegation.delegator.toLocaleLowerCase();

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
    const voterIn =
      voters && voters.length > 0 ? `voter_in: ${JSON.stringify(voters)}` : "";

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

      return this.fetch(SNAPSHOT_URL, GetVotesResponse, { query }).then(
        (resp) =>
          resp.data.votes.map((vote) => {
            vote.voter = vote.voter.toLocaleLowerCase();

            return vote;
          })
      );
    };

    return paginate(fs).then((votes) => {
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
    });
  }

  public async getScores(
    protocol: Protocol,
    snapshot: number,
    voters: string[]
  ): Promise<Scores> {
    switch (protocol) {
      case "cvx-crv":
        return await this.getScoresCvx(snapshot, voters);
      case "aura-bal":
        return await this.getScoresAura(snapshot, voters);
      default:
        throw new Error(`Unkown protocol: '${protocol as string}'`);
    }
  }

  public async getScoresCvx(
    snapshot: number,
    voters: string[]
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

    return this.fetch(SNAPSHOT_SCORE_URL, GetScoresResponse, { params }).then(
      (resp) => {
        return resp.result.scores.map((scores) =>
          mapKeys(scores, (_, key) => key.toLocaleLowerCase())
        );
      }
    );
  }

  public async getScoresAura(
    snapshot: number,
    voters: string[]
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

    return this.fetch(SNAPSHOT_SCORE_URL, GetScoresResponse, { params }).then(
      (resp) => {
        return resp.result.scores.map((scores) =>
          mapKeys(scores, (_, key) => key.toLocaleLowerCase())
        );
      }
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
