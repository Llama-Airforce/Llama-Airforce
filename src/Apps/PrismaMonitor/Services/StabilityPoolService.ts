import { ServiceBase } from "@/Services";
import {
  type DecimalLabelledSeries,
  type DecimalTimeSeries,
} from "@PM/Services/Series";
import { type Flavor, apiUrl } from "@PM/Models/Flavor";

export type PoolStableOperation = {
  user: string;
  amount: number;
  timestamp: number;
  hash: string;
};

export type StableFlows = {
  withdrawals: DecimalTimeSeries[];
  deposits: DecimalTimeSeries[];
};

export default class StabilityPoolService extends ServiceBase {
  private readonly API_URL: string;

  constructor(host: string, flavor: Flavor) {
    super(host);
    this.API_URL = apiUrl(flavor);
  }

  public async getPoolTvl(
    chain: string,
    period: string
  ): Promise<{ deposits: DecimalTimeSeries[] }> {
    return this.fetch(
      `${this.API_URL}/pool/${chain}/deposits?period=${period}`
    );
  }

  public async getStableFlow(
    chain: string,
    period: string
  ): Promise<StableFlows> {
    return this.fetch(
      `${this.API_URL}/pool/${chain}/stable_operations?period=${period}`
    );
  }

  public async getStableDistribution(
    chain: string
  ): Promise<{ distribution: DecimalLabelledSeries[] }> {
    return this.fetch(`${this.API_URL}/pool/${chain}/histogram/deposits`);
  }

  public async getCumulativeWithdrawals(
    chain: string,
    period: string
  ): Promise<{ withdrawals: DecimalTimeSeries[] }> {
    return this.fetch(
      `${this.API_URL}/pool/${chain}/cumulative_withdrawals?period=${period}`
    );
  }

  public async getTopStableDeposits(
    chain: string,
    top: number,
    period: string
  ): Promise<{ operations: PoolStableOperation[] }> {
    return this.fetch(
      `${this.API_URL}/pool/${chain}/top/stable_deposits?top=${top}&period=${period}`
    );
  }

  public async getTopStableWithdrawals(
    chain: string,
    top: number,
    period: string
  ): Promise<{ operations: PoolStableOperation[] }> {
    return this.fetch(
      `${this.API_URL}/pool/${chain}/top/stable_withdrawals?top=${top}&period=${period}`
    );
  }
}
