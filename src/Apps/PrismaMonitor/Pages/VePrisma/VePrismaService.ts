import { ServiceBase } from "@/Services";

// https://thegraph.com/hosted-service/subgraph/benber86/prisma
const THEGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/benber86/prisma";

export type AccountData = {
  id: string; // Address
  weight: number;
  locked: number;
  unlocked: number;
  frozen: number;
};

export type VoteIncentive = {
  voter: string;
  recipient: string;
  weight: number;
  isClearance: boolean;
  transaction: string;
  timestamp: number;
};

type GetTopLockersResponse = {
  data: {
    lockers: {
      totalWeight: string;
    }[];
    accountDatas: {
      id: string; // Address
      weight: string;
      locked: string;
      unlocked: string;
      frozen: string;
    }[];
  };
};

type GetVotesIncentivesResponse = {
  data: {
    incentiveVotes: {
      voter: {
        id: string;
      };
      votes: {
        recipient: {
          id: string;
          address: string;
        };
        weight: string;
      }[];
      isClearance: boolean;
      transactionHash: string;
      blockTimestamp: string;
    }[];
  };
};

export default class VePrismaService extends ServiceBase {
  public async getTopLockers(): Promise<{
    totalWeight: number;
    accounts: AccountData[];
  }> {
    const query = `{
      lockers {
        totalWeight
      }
      accountDatas(first: 100 orderBy: weight orderDirection: desc) {
        id
        weight
        locked
        unlocked
        frozen
      }
    }`;

    const resp = await this.fetch<GetTopLockersResponse>(THEGRAPH_URL, {
      query,
    });

    const accounts = resp.data.accountDatas.map((x) => ({
      id: x.id,
      weight: parseInt(x.weight, 10),
      locked: parseInt(x.locked, 10),
      unlocked: parseInt(x.unlocked, 10),
      frozen: parseInt(x.frozen, 10),
    }));

    const totalWeight = parseInt(resp.data.lockers[0].totalWeight, 10);

    return { totalWeight, accounts };
  }

  public async getVotesIncentives(): Promise<VoteIncentive[]> {
    const query = `{
      incentiveVotes(first:100, orderBy:blockNumber, orderDirection:desc) {
        voter {
          id
        }
        votes(first: 100, orderBy:weight, orderDirection:desc) {
          recipient {
            id
            address
          }
          weight
        }
        isClearance
        transactionHash
        blockTimestamp
      }
    }`;

    const resp = await this.fetch<GetVotesIncentivesResponse>(THEGRAPH_URL, {
      query,
    });

    return resp.data.incentiveVotes
      .map((iv) =>
        iv.votes.map((vote) => ({
          voter: iv.voter.id,
          recipient: vote.recipient.address,
          weight: parseInt(vote.weight, 10),
          isClearance: iv.isClearance,
          transaction: iv.transactionHash,
          timestamp: parseInt(iv.blockTimestamp, 10),
        }))
      )
      .flat();
  }
}
