import { ServiceBase } from "@/Services";
import {
  type DecimalLabelledSeries,
  type DecimalTimeSeries,
} from "@PM/Services/Series";

const API_URL = "https://api.prismamonitor.com/v1";

type Flow = {
  amount: number;
  amount_usd: number;
  count: number;
  timestamp: number;
};

export type Flows = {
  withdrawals: Flow[];
  deposits: Flow[];
};

export type SnapshotWrapper = {
  token_balance: number;
  token_supply: number;
  tvl: number;
  total_apr: number;
  apr_breakdown: { apr: number; token: string }[];
  timestamp: number;
};

export type Contract = "convex" | "yearn";

export function getContractAddress(contract: Contract) {
  switch (contract) {
    case "convex":
      return "0x0c73f1cfd5c9dfc150c8707aa47acbd14f0be108";
    case "yearn":
      return "0x774a55c3eeb79929fd445ae97191228ab39c4d0f";
  }
}

export default class WrapperService extends ServiceBase {
  public async getTVL(contract: Contract): Promise<{
    tvl: DecimalTimeSeries[];
  }> {
    return this.fetch(
      `${API_URL}/staking/${getContractAddress(
        contract
      )}/tvl?period=all&groupby=day`
    );
  }

  public async getFlow(contract: Contract): Promise<Flows> {
    return this.fetch(
      `${API_URL}/staking/${getContractAddress(
        contract
      )}/flow?period=all&groupby=day`
    );
  }

  public async getDistribution(contract: Contract): Promise<{
    distribution: DecimalLabelledSeries[];
  }> {
    return this.fetch(
      `${API_URL}/staking/${getContractAddress(contract)}/distribution`
    );
  }

  public async getSnapshots(contract: Contract): Promise<{
    Snapshots: SnapshotWrapper[];
  }> {
    return this.fetch(
      `${API_URL}/staking/${getContractAddress(contract)}/snapshots?period=7d`
    );
  }
}
