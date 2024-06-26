import { ServiceBase } from "@/Services";
import { type Flavor, apiUrl } from "@PM/Models/Flavor";

export type SnapshotRevenue = {
  unlock_penalty_revenue_usd: number;
  borrowing_fees_revenue_usd: number;
  redemption_fees_revenue_usd: number;
  timestamp: number;
};

export type Breakdown = {
  unlock_penalty: number;
  borrowing_fees: number;
  redemption_fees: number;
};

export default class RevenueService extends ServiceBase {
  private readonly API_URL: string;

  constructor(flavor: Flavor) {
    super();
    this.API_URL = apiUrl(flavor);
  }

  public async getSnapshots(): Promise<{
    snapshots: SnapshotRevenue[];
  }> {
    return this.fetch(`${this.API_URL}/revenue/ethereum/snapshots?period=3m`);
  }

  public async getBreakdown(): Promise<Breakdown> {
    return this.fetch(`${this.API_URL}/revenue/ethereum/breakdown`);
  }
}
