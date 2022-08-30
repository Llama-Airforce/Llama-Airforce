import type { ProposalId } from "@/Pages/Bribes/Models/Epoch";
import type { Protocol } from "@/Pages/Bribes/Models/Protocol";
import ServiceBase from "@/Services/ServiceBase";
import { paginate } from "@/Util/PaginationHelper";
import { mapKeys } from "lodash";

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

    return paginate(fs);
  }

  public getSpace(protocol: Protocol): string {
    switch (protocol) {
      case "cvx-crv":
        return "cvx.eth";
      case "aura-bal":
        return "aurafinance.eth";
      default:
        throw new Error(
          `Protocol '${protocol as string}' has no Snapshot space`
        );
    }
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
      space: this.getSpace("cvx-crv"),
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
    const address = "0x3Fa73f1E5d8A792C80F426fc8F84FBF7Ce9bBCAC";

    const strategies = [
      {
        name: "erc20-votes",
        params: {
          symbol: "vlAURA",
          address,
          decimals: 18,
        },
      },
    ];

    const params = {
      space: this.getSpace("aura-bal"),
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
