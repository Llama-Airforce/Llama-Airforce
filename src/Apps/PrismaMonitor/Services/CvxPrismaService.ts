import ServiceBase from "@/Services/ServiceBase";
import {
  type DecimalLabelledSeries,
  type DecimalTimeSeries,
} from "@PM/Services/Series";

const API_URL = "https://api.prismamonitor.com/v1";

type CvxPrismaFlow = {
  amount: number;
  amount_usd: number;
  count: number;
  timestamp: number;
};

export type CvxPrismaFlows = {
  withdrawals: CvxPrismaFlow[];
  deposits: CvxPrismaFlow[];
};

export type CvxPrismaSnapshot = {
  token_balance: number;
  token_supply: number;
  tvl: number;
  total_apr: number;
  apr_breakdown: { apr: number; token: string }[];
  timestamp: number;
};

export default class CvxPrismaService extends ServiceBase {
  public async getTVL(): Promise<{
    tvl: DecimalTimeSeries[];
  }> {
    return this.fetch(`${API_URL}/staking/tvl?period=all&groupby=day`);
  }

  public async getFlow(): Promise<CvxPrismaFlows> {
    return this.fetch(`${API_URL}/staking/flow?period=all&groupby=day`);
  }

  public async getDistribution(): Promise<{
    distribution: DecimalLabelledSeries[];
  }> {
    return this.fetch(`${API_URL}/staking/distribution`);
  }

  public async getSnapshots(): Promise<{
    Snapshots: CvxPrismaSnapshot[];
  }> {
    return this.fetch(`${API_URL}/staking/snapshots?period=7d`);
  }
}
