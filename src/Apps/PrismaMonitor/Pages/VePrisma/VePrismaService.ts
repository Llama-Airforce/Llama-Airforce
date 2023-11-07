import ServiceBase from "@/Services/ServiceBase";

// https://thegraph.com/hosted-service/subgraph/benber86/prisma-test
const THEGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/benber86/prisma-test";

export type AccountData = {
  id: string; // Address
  weight: number;
  locked: number;
  unlocked: number;
  frozen: number;
};

type GetTopLockersResponse = {
  data: {
    lockers: {
      totalWeight: string;
    };
    accountDatas: {
      id: string; // Address
      weight: string;
      locked: string;
      unlocked: string;
      frozen: string;
    }[];
  };
};

export default class VePrismaService extends ServiceBase {
  public async getTopLockers(): Promise<AccountData[]> {
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

    return resp.data.accountDatas.map((x) => ({
      id: x.id,
      weight: parseInt(x.weight, 10),
      locked: parseInt(x.locked, 10),
      unlocked: parseInt(x.unlocked, 10),
      frozen: parseInt(x.frozen, 10),
    }));
  }
}
